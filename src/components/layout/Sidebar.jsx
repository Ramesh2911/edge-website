import {
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

export default function Sidebar() {

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

        <aside className="bg-white h-screen shadow-lg sticky top-0">

            {/* Logo */}

            <div className="h-20 flex items-center justify-center border-b">

                <h2 className="text-2xl font-bold text-blue-600">

                    Edge Mile Realty

                </h2>

            </div>

            {/* Menu */}

            <div className="py-6">

                {

                    menus.map((menu) => {

                        const Icon = menu.icon;

                        return (

                            <NavLink

                                key={menu.path}

                                to={menu.path}

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

    );

}