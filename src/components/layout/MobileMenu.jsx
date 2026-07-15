import {
    X,
    LayoutDashboard,
    Building2,
    PlusSquare,
    Heart,
    User,
    Lock,
    FileText,
    LogOut,
    ChevronRight
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

export default function MobileMenu({

    open,

    onClose

}) {

    const navigate = useNavigate();

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

    };

    const menus = [

        {
            title: "Dashboard",
            icon: LayoutDashboard,
            path: "/dashboard"
        },

        {
            title: "My Properties",
            icon: Building2,
            path: "/my-properties"
        },

        {
            title: "Add Property",
            icon: PlusSquare,
            path: "/add-property"
        },

        {
            title: "Wishlist",
            icon: Heart,
            path: "/wishlist"
        },

        {
            title: "Buyer Requirement",
            icon: FileText,
            path: "/buyer-requirement"
        },

        {
            title: "Profile",
            icon: User,
            path: "/profile"
        },

        {
            title: "Change Password",
            icon: Lock,
            path: "/change-password"
        }

    ];

    return (

        <>

            {/* Overlay */}

            <div

                onClick={onClose}

                className={`

                fixed

                inset-0

                bg-black/40

                z-40

                transition-opacity

                duration-300

                ${open

                        ? "opacity-100 visible"

                        : "opacity-0 invisible"

                    }

                `}

            />

            {/* Sidebar */}

            <aside

                className={`

                fixed

                top-0

                left-0

                h-full

                w-72

                bg-white

                shadow-xl

                z-50

                transition-transform

                duration-300

                ${open

                        ? "translate-x-0"

                        : "-translate-x-full"

                    }

                `}

            >

                {/* Header */}

                <div className="flex items-center justify-between px-5 h-20 border-b">

                    <h2 className="text-2xl font-bold text-blue-600">

                        Edge Mile Realty

                    </h2>

                    <button onClick={onClose}>

                        <X size={28} />

                    </button>

                </div>

                {/* Menu */}

                <div className="py-5">

                    {

                        menus.map((menu) => {

                            const Icon = menu.icon;

                            return (

                                <NavLink

                                    key={menu.path}

                                    to={menu.path}

                                    onClick={onClose}

                                    className={({ isActive }) =>

                                        `

                                        flex

                                        items-center

                                        justify-between

                                        mx-3

                                        mb-2

                                        px-4

                                        py-3

                                        rounded-xl

                                        transition-all

                                        duration-300

                                        ${isActive

                                            ?

                                            "bg-blue-600 text-white"

                                            :

                                            "hover:bg-blue-50 text-gray-700"

                                        }

                                        `

                                    }

                                >

                                    <div className="flex items-center gap-3">

                                        <Icon size={20} />

                                        <span>

                                            {menu.title}

                                        </span>

                                    </div>

                                    <ChevronRight size={18} />

                                </NavLink>

                            );

                        })

                    }

                </div>

                {/* Logout */}

                <div className="absolute bottom-5 left-0 right-0 px-4">

                    <button

                        onClick={logout}

                        className="

                        w-full

                        flex

                        items-center

                        justify-center

                        gap-3

                        bg-red-500

                        hover:bg-red-600

                        text-white

                        py-3

                        rounded-xl

                        "

                    >

                        <LogOut size={20} />

                        Logout

                    </button>

                </div>

            </aside>

        </>

    );

}