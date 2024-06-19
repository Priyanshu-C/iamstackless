"use client";

import { Button, Slider } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BiReset } from "react-icons/bi";

const gridVariants = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
};

const TicTacToe = () => {
    const [rows, setRows] = useState(3);
    const [player, setPlayer] = useState<"X" | "O">("X");
    const [board, setBoard] = useState<string[][]>(
        Array.from({ length: rows }, () => Array(rows).fill(""))
    );

    useEffect(() => {
        setBoard(Array.from({ length: rows }, () => Array(rows).fill("")));
    }, [rows]);

    const alertWinner = () => {
        alert(`Player ${player} wins!`);
        resetGame();
    };

    const checkWinner = (board: string[][]): boolean => {
        // Check rows and columns
        for (let i = 0; i < rows; i++) {
            if (
                board[i].every((cell) => cell === player) ||
                board.every((row) => row[i] === player)
            ) {
                return true;
            }
        }

        // Check diagonals
        const mainDiagonal = board.every((row, idx) => row[idx] === player);
        const antiDiagonal = board.every(
            (row, idx) => row[rows - idx - 1] === player
        );

        return mainDiagonal || antiDiagonal;
    };

    const resetGame = () => {
        setBoard(Array.from({ length: rows }, () => Array(rows).fill("")));
        setPlayer("X");
    };

    const handleClick = (i: number, j: number) => {
        if (board[i][j] === "") {
            const newBoard = board.map((row, rowIndex) =>
                rowIndex === i
                    ? row.map((cell, cellIndex) =>
                          cellIndex === j ? player : cell
                      )
                    : row
            );
            setBoard(newBoard);
            if (checkWinner(newBoard)) {
                alertWinner();
            } else {
                setPlayer((prevPlayer) => (prevPlayer === "X" ? "O" : "X"));
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <h1 className="text-4xl font-bold text-center mb-4">Tic Tac Toe</h1>
            <div className="flex items-center justify-center gap-8">
                <Slider
                    label="Number of Rows"
                    step={1}
                    maxValue={5}
                    minValue={1}
                    defaultValue={rows}
                    className="w-[400px] my-4"
                    color="secondary"
                    onChange={(value: number | number[]) =>
                        setRows(Number(value))
                    }
                />
                <Button isIconOnly variant="shadow" onClick={resetGame}>
                    <BiReset className="text-2xl" />
                </Button>
            </div>
            <div className="flex flex-col items-center justify-center m-16">
                <p className="mb-8 text-2xl">
                    Player's Turn:{" "}
                    <span className="text-3xl text-secondary">{player}</span>
                </p>
                <div className="flex items-center justify-center w-full">
                    <div className={`grid ${gridVariants[rows]} gap-2`}>
                        <AnimatePresence>
                            {board.map((row, i) =>
                                row.map((cell, j) => (
                                    <motion.div
                                        key={`${i}-${j}`}
                                        onClick={() => handleClick(i, j)}
                                        className="w-16 h-16 cursor-pointer text-black text-2xl font-semibold bg-gray-200 flex items-center justify-center"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        {cell}
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicTacToe;
