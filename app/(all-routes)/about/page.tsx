import React from "react";

const page = () => {
    return (
        <>
            <h1 className="text-4xl font-bold text-center">About</h1>
            <div className="max-w-5xl mx-auto mt-8">
                <p className="text-2xl text-start">
                    Hi there, It&apos;s{" "}
                    <span className="font-bold text-600">
                        Priyanshu Chauhan
                    </span>{" "}
                    in the house! 🚀, I&apos;m not your average Software
                    Engineer—I&apos;m all about crafting awesome web experiences
                    for a large-scale audience. I love traveling, have a drone
                    vlogging page, and am a big-time foodie 🍲. In my free time,
                    I play badminton 🏸 or watch anime 🌸.
                </p>

                <p className="text-2xl text-center mt-12">
                    It&apos;s Storytime:{" "}
                </p>
                <div className="flex items-center mt-4">
                    <img
                        alt="Lucknow"
                        src="./images/about/lucknow.png"
                        className="w-80 h-80 mx-auto mr-4"
                    />{" "}
                    <p className="text-xl text-start mt-4">
                        Long time ago, a boy was born in a city you may know as{" "}
                        <span className="font-bold">
                            &apos;Nawabo ka Sheher&apos; - Lucknow
                        </span>
                        . He was a curious child and always wanted to know how
                        things work. He was always fascinated by computers and
                        the internet.
                    </p>
                </div>
                <div className="flex items-center mt-4">
                    <p className="text-xl text-start mt-4">
                        I did my B.Tech in Information Technology from{" "}
                        <span className="font-bold">
                            SRM University, KTR, Chennai.{" "}
                        </span>{" "}
                        I was leading a team of 25 members for a technical fest
                        to edit videos and photos.
                    </p>
                    <img
                        alt="Lucknow"
                        src="./images/about/chennai.png"
                        className="w-80 h-80 mx-auto float-left ml-4"
                    />{" "}
                </div>

                <div className="flex items-center mt-4">
                    <img
                        alt="Lucknow"
                        src="./images/about/bangalore.png"
                        className="w-80 h-80 mx-auto mr-4"
                    />{" "}
                    <p className="text-xl text-start mt-4">
                        Fast Forward to 2024, It&apos;s been 3 years working as
                        a Senior Frontend Engineer at{" "}
                        <span className="font-bold">
                            Razorpay in Bangalore.
                        </span>{" "}
                        I worked on various projects and learned a lot about web
                        development.
                    </p>
                </div>
            </div>
        </>
    );
};

export default page;
