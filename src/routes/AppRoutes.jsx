import { BrowserRouter, Routes, Route } from "react-router-dom";

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

import NotFound from "../pages/NotFound/NotFound";

export default function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                {/* ==========================
                    Website Routes
                ========================== */}

                <Route element={<MainLayout />}>

                    <Route path="/" element={<Home />} />

                    <Route path="/about" element={<About />} />

                    <Route path="/contact" element={<Contact />} />

                    <Route path="/properties" element={<PropertyList />} />

                    <Route path="/properties/details/:id" element={<PropertyDetails />} />

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

                    </Route>

                </Route>

                {/* ==========================
                    404
                ========================== */}

                <Route

                    path="*"

                    element={<NotFound />}

                />

            </Routes>

        </BrowserRouter>

    );

}