import { ArrowUpRight } from "lucide-react";

export default function DashboardCard({
    title,
    value,
    icon: Icon,
    color = "blue",
    description = "",
    onClick,
}) {
    const colors = {
        blue: {
            bg: "bg-blue-50",
            icon: "bg-blue-600",
            text: "text-blue-600",
        },
        green: {
            bg: "bg-green-50",
            icon: "bg-green-600",
            text: "text-green-600",
        },
        red: {
            bg: "bg-red-50",
            icon: "bg-red-600",
            text: "text-red-600",
        },
        yellow: {
            bg: "bg-yellow-50",
            icon: "bg-yellow-500",
            text: "text-yellow-600",
        },
        purple: {
            bg: "bg-purple-50",
            icon: "bg-purple-600",
            text: "text-purple-600",
        },
    };

    const style = colors[color] || colors.blue;

    return (
        <div
            onClick={onClick}
            className={`
                ${style.bg}
                rounded-2xl
                p-6
                shadow-sm
                hover:shadow-lg
                transition-all
                duration-300
                cursor-pointer
                border
                border-gray-100
            `}
        >
            <div className="flex items-center justify-between">

                <div>

                    <p className="text-gray-500 text-sm">

                        {title}

                    </p>

                    <h2 className="text-3xl font-bold mt-2">

                        {value}

                    </h2>

                </div>

                <div
                    className={`
                        ${style.icon}
                        w-14
                        h-14
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        text-white
                    `}
                >

                    {Icon && <Icon size={28} />}

                </div>

            </div>

            <div className="mt-6 flex items-center justify-between">

                <p className={`text-sm ${style.text}`}>

                    {description}

                </p>

                <ArrowUpRight
                    size={18}
                    className={style.text}
                />

            </div>

        </div>
    );
}