import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ChatWidget from "../components/common/ChatWidget";

export default function DashboardLayout() {
    return (
        <>
            <Header />

            <main className="min-h-screen bg-cream">
                <Outlet />
            </main>

            <Footer />

            <ChatWidget />
        </>
    );
}
