import React from "react";

export default function Loader({

    size = 40,

    text = "Loading..."

}) {

    return (

        <div className="flex flex-col items-center justify-center py-6">

            <div

                className="animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"

                style={{
                    width: size,
                    height: size
                }}

            />

            <p className="mt-3 text-gray-600 text-sm">

                {text}

            </p>

        </div>

    );

}