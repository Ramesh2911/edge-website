import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { WishlistProvider } from "../context/WishlistContext";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";

// Public Pages
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";

import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import FooterContentPage from "../pages/FooterContent/FooterContentPage";
import LegalPage from "../pages/Legal/LegalPage";

// Property
import PropertyList from "../pages/Property/PropertyList";
import PropertyDetails from "../pages/Property/PropertyDetails";

// Dashboard
import Dashboard from "../pages/Dashboard/Dashboard";

import Profile from "../pages/Profile/Profile";
import ChangePassword from "../pages/Profile/ChangePassword";

import AddProperty from "../pages/Property/AddProperty";
import EditProperty from "../pages/Property/EditProperty";
import MyProperties from "../pages/Property/MyProperties";

import Wishlist from "../pages/Buyer/Wishlist";
import Interested from "../pages/Buyer/Interested";

import BuyerRequirement from "../pages/Lead/BuyerRequirement";

import SiteVisits from "../pages/SiteVisits/SiteVisits";
import Deals from "../pages/Deals/Deals";
import Commissions from "../pages/Commission/Commissions";
import Reports from "../pages/Reports/Reports";
import Projects from "../pages/Projects/Projects";
import ManageUnits from "../pages/Units/ManageUnits";

import NotFound from "../pages/NotFound/NotFound";

// SPA route change e page top-e scroll koro — na hole footer theke
// navigate korle notun page er niche (same footer) e thake, mone hoy na move hoyeche.
function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

export default function AppRoutes() {

    return (

        <BrowserRouter>

            <ScrollToTop />

            <WishlistProvider>

            <Routes>

                {/* ==========================
                    Website Routes
                ========================== */}

                <Route element={<MainLayout />}>

                    <Route path="/" element={<Home />} />

                    <Route path="/about" element={<About />} />

                    <Route path="/contact" element={<Contact />} />

                    {/* Legal pages (admin-managed via Page Content → Legal) */}
                    <Route path="/privacy-policy" element={<LegalPage kind="privacy" />} />

                    <Route path="/terms-and-conditions" element={<LegalPage kind="terms" />} />

                    <Route path="/properties" element={<PropertyList />} />

                    <Route path="/properties/details/:id" element={<PropertyDetails />} />

                    {/* Footer menu content pages (e.g. /listing-policy) — static routes rank higher */}
                    <Route path="/:slug" element={<FooterContentPage />} />

                </Route>

                {/* ==========================
                    Public Routes
                ========================== */}

                <Route element={<PublicRoutes />}>

                    <Route path="/login" element={<Login />} />

                    <Route path="/register" element={<Register />} />

                    <Route

                        path="/forgot-password"

                        element={<ForgotPassword />}

                    />

                </Route>

                {/* ==========================
                    Private Routes
                ========================== */}

                <Route element={<PrivateRoutes />}>

                    <Route element={<DashboardLayout />}>

                        <Route

                            path="/dashboard"

                            element={<Dashboard />}

                        />

                        <Route

                            path="/profile"

                            element={<Profile />}

                        />

                        <Route

                            path="/change-password"

                            element={<ChangePassword />}

                        />

                        <Route

                            path="/my-properties"

                            element={<MyProperties />}

                        />

                        <Route

                            path="/add-property"

                            element={<AddProperty />}

                        />

                        <Route

                            path="/edit-property/:id"

                            element={<EditProperty />}

                        />

                        <Route

                            path="/wishlist"

                            element={<Wishlist />}

                        />

                        <Route

                            path="/interested"

                            element={<Interested />}

                        />

                        <Route

                            path="/buyer-requirement"

                            element={<BuyerRequirement />}

                        />

                        <Route path="/site-visits" element={<SiteVisits />} />

                        <Route path="/deals" element={<Deals />} />

                        <Route path="/commissions" element={<Commissions />} />

                        <Route path="/reports" element={<Reports />} />

                        <Route path="/projects" element={<Projects />} />

                        <Route path="/manage-units" element={<ManageUnits />} />

                    </Route>

                </Route>

                {/* ==========================
                    404
                ========================== */}

                <Route element={<MainLayout />}>

                    <Route

                        path="*"

                        element={<NotFound />}

                    />

                </Route>

            </Routes>

            </WishlistProvider>

        </BrowserRouter>

    );

}