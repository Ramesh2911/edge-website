import {
    TrendingUp,
    TrendingDown
} from "lucide-react";

export default function DashboardStats({

    title,

    total,

    progress = 0,

    color = "blue",

    trend = "up",

    percentage = 0

}) {

    const colors = {

        blue: {

            bg: "bg-blue-500",

            text: "text-blue-600"

        },

        green: {

            bg: "bg-green-500",

            text: "text-green-600"

        },

        yellow: {

            bg: "bg-yellow-500",

            text: "text-yellow-600"

        },

        red: {

            bg: "bg-red-500",

            text: "text-red-600"

        },

        purple: {

            bg: "bg-purple-500",

            text: "text-purple-600"

        }

    };

    const style = colors[color] || colors.blue;

    return (

        <div className="bg-white rounded-xl shadow p-6">

            <div className="flex justify-between items-center">

                <h4 className="text-gray-600 font-medium">

                    {title}

                </h4>

                {

                    trend === "up"

                        ?

                        <TrendingUp
                            className="text-green-500"
                            size={22}
                        />

                        :

                        <TrendingDown
                            className="text-red-500"
                            size={22}
                        />

                }

            </div>

            <h2 className="text-3xl font-bold mt-4">

                {total}

            </h2>

            <div className="mt-5">

                <div className="flex justify-between text-sm mb-2">

                    <span>

                        Progress

                    </span>

                    <span>

                        {progress}%

                    </span>

                </div>

                <div className="h-2 bg-gray-200 rounded-full">

                    <div

                        className={`${style.bg} h-2 rounded-full transition-all duration-500`}

                        style={{

                            width: `${progress}%`

                        }}

                    />

                </div>

            </div>

            <p className={`mt-5 font-medium ${style.text}`}>

                {

                    trend === "up"

                        ?

                        `+${percentage}% this month`

                        :

                        `-${percentage}% this month`

                }

            </p>

        </div>

    );

}