import React from "react";
import { Todo } from "./page";
import { Card } from "@nextui-org/react";
import { FaDeleteLeft } from "react-icons/fa6";
import { MdDelete, MdOutlineDone } from "react-icons/md";
import { TiTick } from "react-icons/ti";

type TodoItem = {
    todo: Todo;
    toogleTodo: ({ id }: { id: number }) => void;
    deleteTodo: ({ id }: { id: number }) => void;
};

const TodoItem = ({ todo, toogleTodo, deleteTodo }: TodoItem) => {
    const isDone = todo.status == "done";

    return (
        <div className="my-2 p-2 bg-zinc-800 rounded-sm flex justify-between">
            <div className={isDone ? `line-through text-zinc-500` : ""}>
                {todo.value}
            </div>
            <span className="flex gap-2">
                <div onClick={() => toogleTodo({ id: todo.id })}>
                    <MdOutlineDone size={22} />
                </div>
                <div onClick={() => deleteTodo({ id: todo.id })}>
                    <MdDelete size={22} />
                </div>
            </span>
        </div>
    );
};

export default TodoItem;
