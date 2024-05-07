import React from "react";

const page = () => {
    return (
        <>
            <h1 className="text-4xl font-bold text-center">About</h1>
            <div className="max-w-5xl mx-auto mt-8">
                <p className="text-2xl text-start">
                    Hi, This is{" "}
                    <span className="font-bold0">Priyanshu Chauhan</span> here,
                    I am a software engineer with a passion for web development.
                    I have experience in building web applications for scale. I
                    love traveling, have a drone vloging page and I am a big
                    time foodie. In my free time, I play badminton or watch
                    anime. 🏸 🍲 🌸
                </p>

                <p className="text-3xl text-start mt-4 ">Story time....</p>
                <p className="text-2xl text-start mt-4 flex items-center">
                    <img
                        alt="Lucknow"
                        src="./images/about/lucknow.png"
                        className="w-60 h-60 mx-auto float-right"
                    />{" "}
                    Long time ago, a boy was born in a city you may know as
                    &apos;Nawabo ka Sheher&apos; - Lucknow. He was a curious
                    child and always wanted to know how things work. He was
                    always fascinated by computers and the internet.
                </p>

                <p className="text-2xl text-start mt-4 flex items-center">
                    I went to to City Montessori School, Lucknow for my
                    schooling. I was the Cyber Head of my school and I used to
                    participate in various competitions and hackathons.
                    <img
                        alt="Lucknow"
                        src="./images/about/cms.png"
                        className="w-60 h-60 mx-auto float-right"
                    />{" "}
                </p>
                <div className="flex items-center">
                    <img
                        alt="Lucknow"
                        src="./images/about/chennai.png"
                        className="w-60 h-60 mx-auto float-left"
                    />{" "}
                    <p className="text-2xl text-start mt-4">
                        I did my B.Tech in Information Technology from{" "}
                        <span className="font-bold">
                            SRM University, KTR, Chennai.{" "}
                        </span>{" "}
                        I was leading a team of 25 members for a technical fest
                        to edit videos and photos.
                    </p>
                </div>

                <div className="flex items-center">
                    <p className="text-2xl text-start mt-4">
                        Fast Forward to 2024, It&apos;s been 3 years working as
                        a senior software engineer at{" "}
                        <span className="font-bold">Razorpay</span> in
                        Bangalore. I worked on various projects and learned a
                        lot about web development.
                    </p>
                    <img
                        alt="Lucknow"
                        src="./images/about/bangalore.png"
                        className="w-60 h-60 mx-auto float-right"
                    />{" "}
                </div>
            </div>
        </>
    );
};

export default page;
