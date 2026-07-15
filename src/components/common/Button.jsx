import React from "react";

export default function Button({

    children,

    type = "button",

    variant = "primary",

    size = "md",

    fullWidth = false,

    loading = false,

    disabled = false,

    onClick,

    className = ""

}) {

    const variants = {

        primary:
            "bg-[#1E4C8C] hover:bg-[#173C6E] text-white shadow-md shadow-[#1E4C8C]/25",

        secondary:
            "bg-[#EAF1FB] hover:bg-[#DCE8F7] text-[#153964]",

        success:
            "bg-[#7CB93D] hover:bg-[#6FA82C] text-white shadow-md shadow-[#7CB93D]/25",

        danger:
            "bg-red-600 hover:bg-red-700 text-white",

        outline:
            "border-2 border-[#1E4C8C] text-[#1E4C8C] hover:bg-[#EAF1FB]"

    };

    const sizes = {

        sm: "px-3 py-2 text-sm",

        md: "px-5 py-2.5",

        lg: "px-6 py-3 text-lg"

    };

    return (

        <button

            type={type}

            disabled={disabled || loading}

            onClick={onClick}

            className={`

            rounded-xl

            font-semibold

            transition-all

            duration-300

            flex

            items-center

            justify-center

            gap-2

            active:scale-[0.98]

            ${variants[variant]}

            ${sizes[size]}

            ${fullWidth ? "w-full" : ""}

            ${disabled ? "opacity-50 cursor-not-allowed active:scale-100" : ""}

            ${className}

            `}

        >

            {

                loading &&

                <svg

                    className="animate-spin h-5 w-5"

                    viewBox="0 0 24 24"

                    fill="none"

                >

                    <circle

                        cx="12"

                        cy="12"

                        r="10"

                        stroke="currentColor"

                        strokeWidth="3"

                        opacity=".25"

                    />

                    <path

                        fill="currentColor"

                        d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"

                    />

                </svg>

            }

            {children}

        </button>

    );

}