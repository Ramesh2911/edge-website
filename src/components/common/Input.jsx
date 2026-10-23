import React from "react";

export default function Input({

    label,

    name,

    value,

    onChange,

    type = "text",

    placeholder = "",

    error = "",

    required = false,

    disabled = false

}) {

    return (

        <div className="mb-5">

            {

                label && (

                    <label

                        className="block mb-2 font-medium"

                    >

                        {label}

                        {

                            required &&

                            <span className="text-red-500">

                                *

                            </span>

                        }

                    </label>

                )

            }

            <input

                type={type}

                name={name}

                value={value}

                onChange={onChange}

                placeholder={placeholder}

                disabled={disabled}

                className={`
                w-full

                px-4

                py-2.5

                rounded-xl

                border-2

                outline-none

                transition-all

                text-sm

                ${error

                        ?

                        "border-red-400"

                        :

                        "border-slate-200 bg-[#F7FAFC] focus:bg-white focus:border-[#7CB93D] focus:ring-4 focus:ring-[#7CB93D]/15"

                    }

                ${disabled

                        ?

                        "bg-slate-100 text-slate-400 cursor-not-allowed"

                        :

                        ""

                    }

                `}

            />

            {

                error &&

                <p

                    className="text-red-500 text-sm mt-1"

                >

                    {error}

                </p>

            }

        </div>

    );

}