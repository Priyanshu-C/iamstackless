import React from "react";
import SecondFold from "../../../components/SecondFold";

const page = () => {
    return (
        <div className="flex min-h-screen flex-col items-start justify-center">
            <h1 className="text-4xl font-bold text-center pl-8">About Page</h1>
            <SecondFold />
        </div>
    );
};

export default page;
