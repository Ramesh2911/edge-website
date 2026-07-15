import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import MobileMenu from "../components/layout/MobileMenu";

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <MobileMenu open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="min-h-screen bg-cream lg:flex lg:items-start">
                <div className="hidden lg:block lg:w-72">
                    <Sidebar />
                </div>
                <div className="flex-1">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        className="fixed bottom-4 right-4 z-50 rounded-full bg-gold p-4 shadow-lg text-white lg:hidden"
                    >
                        Open menu
                    </button>
                    <Outlet />
                </div>
            </div>
        </>
    );
}
