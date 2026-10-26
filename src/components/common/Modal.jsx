import { X } from "lucide-react";

export default function Modal({
    isOpen,
    onClose,
    title = "",
    children,
    size = "md",
    footer = null,
    closeOnOverlay = true,
}) {
    if (!isOpen) return null;

    const sizes = {
        sm: "max-w-md",
        md: "max-w-2xl",
        lg: "max-w-4xl",
        xl: "max-w-6xl",
        full: "max-w-7xl",
    };

    const handleOverlayClick = () => {
        if (closeOnOverlay) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* Overlay */}

            <div
                className="absolute inset-0 bg-black/50"
                onClick={handleOverlayClick}
            />

            {/* Modal */}

            <div
                className={`relative bg-white rounded-xl shadow-xl w-full mx-4 ${sizes[size]}`}
            >

                {/* Header */}

                <div className="flex items-center justify-between border-b px-4 sm:px-6 py-4">

                    <h2 className="text-xl font-semibold">

                        {title}

                    </h2>

                    <button
                        onClick={onClose}
                        className="hover:bg-gray-100 rounded-full p-2"
                    >

                        <X size={22} />

                    </button>

                </div>

                {/* Body */}

                <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">

                    {children}

                </div>

                {/* Footer */}

                {footer && (

                    <div className="border-t px-6 py-4">

                        {footer}

                    </div>

                )}

            </div>

        </div>
    );
}