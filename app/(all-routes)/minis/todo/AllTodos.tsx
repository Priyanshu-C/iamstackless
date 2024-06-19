import React from "react";
import { Todo } from "./page";
import TodoItem from "./TodoItem";

type AllTodos = {
    todos: Todo[];
    toogleTodo: ({ id }: { id: number }) => void;
    deleteTodo: ({ id }: { id: number }) => void;
};

const AllTodos = ({ todos, toogleTodo, deleteTodo }: AllTodos) => {
    return (
        <div>
            {todos.map((todo) => (
                <TodoItem
                    toogleTodo={toogleTodo}
                    deleteTodo={deleteTodo}
                    todo={todo}
                    key={todo.id}
                />
            ))}
        </div>
    );
};

export default AllTodos;
