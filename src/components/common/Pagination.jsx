import {
    ChevronLeft,
    ChevronRight
} from "lucide-react";

export default function Pagination({

    currentPage,

    totalPages,

    onPageChange

}) {

    if (totalPages <= 1) {

        return null;

    }

    const pages = [];

    for (

        let i = 1;

        i <= totalPages;

        i++

    ) {

        pages.push(i);

    }

    return (

        <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">

            {/* Previous */}

            <button

                disabled={currentPage === 1}

                onClick={() => onPageChange(currentPage - 1)}

                className="border rounded-lg p-2 disabled:opacity-40"

            >

                <ChevronLeft size={18} />

            </button>

            {/* Pages */}

            {

                pages.map((page) => (

                    <button

                        key={page}

                        onClick={() => onPageChange(page)}

                        className={`

                        w-10

                        h-10

                        rounded-lg

                        transition-all

                        ${currentPage === page

                                ? "bg-blue-600 text-white"

                                : "border hover:bg-gray-100"

                            }

                        `}

                    >

                        {page}

                    </button>

                ))

            }

            {/* Next */}

            <button

                disabled={currentPage === totalPages}

                onClick={() => onPageChange(currentPage + 1)}

                className="border rounded-lg p-2 disabled:opacity-40"

            >

                <ChevronRight size={18} />

            </button>

        </div>

    );

}