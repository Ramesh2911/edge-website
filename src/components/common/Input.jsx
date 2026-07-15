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

                py-3

                rounded-lg

                border

                outline-none

                transition

                ${error

                        ?

                        "border-red-500"

                        :

                        "border-gray-300 focus:border-blue-600"

                    }

                ${disabled

                        ?

                        "bg-gray-100"

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