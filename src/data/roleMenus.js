import {
    LayoutDashboard,
    Building2,
    PlusCircle,
    Heart,
    MessageSquare,
    CalendarCheck,
    FolderKanban,
    Boxes,
    Handshake,
    IndianRupee,
    BarChart3,
    UserRound,
    Lock,
} from "lucide-react";

const DASHBOARD = { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" };
const BROWSE = { to: "/properties", icon: Building2, label: "Browse Properties" };
const ADD_PROPERTY = { to: "/add-property", icon: PlusCircle, label: "Add Property" };
const MY_PROPERTIES = { to: "/my-properties", icon: Building2, label: "My Properties" };
const WISHLIST = { to: "/wishlist", icon: Heart, label: "My Wishlist" };
const INQUIRIES = { to: "/interested", icon: MessageSquare, label: "My Inquiries" };
const SITE_VISITS = { to: "/site-visits", icon: CalendarCheck, label: "Site Visits" };
const PROJECTS = { to: "/projects", icon: FolderKanban, label: "My Projects" };
const MANAGE_UNITS = { to: "/manage-units", icon: Boxes, label: "Manage Units" };
const DEALS = { to: "/deals", icon: Handshake, label: "Deal Management" };
const COMMISSIONS = { to: "/commissions", icon: IndianRupee, label: "Commission" };
const REPORTS = { to: "/reports", icon: BarChart3, label: "Reports & Analytics" };
const PROFILE = { to: "/profile", icon: UserRound, label: "Profile & Settings" };
const CHANGE_PASSWORD = { to: "/change-password", icon: Lock, label: "Change Password" };

export const ROLE_MENUS = {
    buyer: [
        DASHBOARD,
        BROWSE,
        ADD_PROPERTY,
        WISHLIST,
        INQUIRIES,
        SITE_VISITS,
        PROFILE,
        CHANGE_PASSWORD,
    ],
    broker: [
        DASHBOARD,
        BROWSE,
        ADD_PROPERTY,
        MY_PROPERTIES,
        WISHLIST,
        INQUIRIES,
        SITE_VISITS,
        DEALS,
        COMMISSIONS,
        REPORTS,
        PROFILE,
        CHANGE_PASSWORD,
    ],
    developer: [
        DASHBOARD,
        BROWSE,
        ADD_PROPERTY,
        MY_PROPERTIES,
        WISHLIST,
        INQUIRIES,
        SITE_VISITS,
        PROJECTS,
        MANAGE_UNITS,
        DEALS,
        REPORTS,
        PROFILE,
        CHANGE_PASSWORD,
    ],
};

export const getMenusForRole = (roleName) => {
    const role = String(roleName || "").trim().toLowerCase();
    return ROLE_MENUS[role] || ROLE_MENUS.buyer;
};
