"use client";

import { Button, Input } from "@nextui-org/react";
import React, { useRef } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import AllTodos from "./AllTodos";

export type Todo = {
    value: string;
    status: "todo" | "done";
    id: number;
};

const Todo = () => {
    const [todos, setItems] = useLocalStorage({ key: "todo" });
    const ref = useRef<HTMLInputElement>(null);

    const onAddTodo = (e: { preventDefault: () => void }) => {
        e.preventDefault();

        const value = ref.current?.value.trim() as string;

        if (!value) return;

        const newTodo: Todo = {
            value: ref.current?.value,
            status: "todo",
            id: Date.now(),
        };

        if (ref.current) ref.current.value = "";

        setItems([newTodo, ...todos]);
    };

    const toogleTodo = ({ id }: { id: number }) => {
        const newTodos = todos.map((todo: Todo) =>
            todo.id == id
                ? {
                      ...todo,
                      status: todo.status == "done" ? "todo" : "done",
                  }
                : todo
        );

        setItems(newTodos);
    };

    const deleteTodo = ({ id }: { id: number }) => {
        const newTodos = todos.filter((todo: Todo) => todo.id !== id);

        setItems(newTodos);
    };

    const onClickClearAll = () => {
        setItems([]);
    };

    return (
        <div>
            <h1 className="text-3xl"> Todo </h1>
            <form className="flex w-[500px] my-2" onSubmit={onAddTodo}>
                <Input isClearable className="mr-2" ref={ref} type="text" />
                <Button color="success" type="submit">
                    Add Item
                </Button>
            </form>
            <div>
                <AllTodos
                    toogleTodo={toogleTodo}
                    deleteTodo={deleteTodo}
                    todos={todos}
                />
            </div>
            <div>
                <Button color="danger" onClick={onClickClearAll}>
                    Clear All
                </Button>
            </div>
        </div>
    );
};

export default Todo;
