"use client";
import { useState } from "react";

const useLocalStorage = ({ key }: { key: string }) => {
    const [storedValue, setStoredValue] = useState(() => {
        const items = window.localStorage.getItem(key);
        return items ? JSON.parse(items) : [];
    });

    const setItem = (values: string[]) => {
        window.localStorage.setItem(key, JSON.stringify(values));
        setStoredValue(values);
    };

    return [storedValue, setItem];
};

export default useLocalStorage;
