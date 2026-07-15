import { useState } from "react";
import { Outlet } from "react-router-dom";
import MobileMenu from "../components/layout/MobileMenu";

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <MobileMenu open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="min-h-screen bg-cream">
                <button
                    type="button"
                    onClick={() => setSidebarOpen(true)}
                    className="fixed bottom-4 right-4 z-50 rounded-full bg-gold p-4 shadow-lg text-white"
                >
                    Open menu
                </button>
                <Outlet />
            </div>
        </>
    );
}
