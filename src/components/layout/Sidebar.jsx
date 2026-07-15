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
import authService from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";

const getMenusForRole = (roleName) => {
    const role = String(roleName || "").trim().toLowerCase();
    const baseMenus = [
        {
            title: "Dashboard",
            icon: LayoutDashboard,
            path: "/dashboard"
        }
    ];

    const buyerMenus = [
        {
            title: "Wishlist",
            icon: Heart,
            path: "/wishlist"
        },
        {
            title: "Requirement",
            icon: FileText,
            path: "/buyer-requirement"
        }
    ];

    const ownerMenus = [
        {
            title: "My Properties",
            icon: Building2,
            path: "/my-properties"
        },
        {
            title: "Add Property",
            icon: PlusSquare,
            path: "/add-property"
        }
    ];

    return [
        ...baseMenus,
        ...(role === "buyer" ? buyerMenus : ownerMenus),
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
};

export default function Sidebar() {

    const { user, logout: authLogout } = useAuth();
    const navigate = useNavigate();
    const persistedRoleName = user?.role_name || JSON.parse(localStorage.getItem("user") || "{}")?.role_name || localStorage.getItem("role");
    const menus = getMenusForRole(persistedRoleName);

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Logout API failed", error);
        } finally {
            authLogout();
            navigate("/login");
        }
    };

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