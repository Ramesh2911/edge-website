import { useState } from "react";
import {
    Eye,
    EyeOff,
    LockKeyhole
} from "lucide-react";

import Button from "../common/Button";

export default function ChangePasswordForm({
    loading = false,
    onSubmit
}) {

    const [formData, setFormData] = useState({
        old_password: "",
        new_password: "",
        confirm_password: ""
    });

    const [showPassword, setShowPassword] = useState({
        old: false,
        new: false,
        confirm: false
    });

    const [errors, setErrors] = useState({});

    // ================================
    // Handle Input
    // ================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: ""
        }));
    };

    // ================================
    // Toggle Password
    // ================================

    const togglePassword = (field) => {
        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    // =====================================
    // Password Strength
    // =====================================

    const getPasswordStrength = (password) => {
        let score = 0;

        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        switch (score) {
            case 0:
            case 1:
                return { text: "Weak", color: "bg-red-500", width: "20%" };
            case 2:
                return { text: "Fair", color: "bg-yellow-500", width: "40%" };
            case 3:
                return { text: "Good", color: "bg-blue-500", width: "60%" };
            case 4:
                return { text: "Strong", color: "bg-green-500", width: "80%" };
            default:
                return { text: "Very Strong", color: "bg-emerald-600", width: "100%" };
        }
    };

    const strength = getPasswordStrength(formData.new_password);

    // =====================================
    // Form Validation
    // =====================================

    const validate = () => {
        const validationErrors = {};

        if (!formData.old_password.trim()) {
            validationErrors.old_password = "Current password is required.";
        }

        if (!formData.new_password.trim()) {
            validationErrors.new_password = "New password is required.";
        } else if (formData.new_password.length < 6) {
            validationErrors.new_password = "Password must be at least 6 characters.";
        }

        if (!formData.confirm_password.trim()) {
            validationErrors.confirm_password = "Confirm password is required.";
        } else if (formData.new_password !== formData.confirm_password) {
            validationErrors.confirm_password = "Passwords do not match.";
        }

        setErrors(validationErrors);

        return Object.keys(validationErrors).length === 0;
    };

    // =====================================
    // Submit
    // =====================================

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        onSubmit({
            old_password: formData.old_password,
            new_password: formData.new_password,
            confirm_password: formData.confirm_password
        });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8">

            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <LockKeyhole className="text-blue-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">
                        Change Password
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Update your account password
                    </p>
                </div>
            </div>

            {/* Current Password */}
            <div className="mb-6">
                <label className="block mb-2 font-medium">
                    Current Password
                </label>
                <div className="relative">
                    <input
                        type={showPassword.old ? "text" : "password"}
                        name="old_password"
                        value={formData.old_password}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-3 pr-12 focus:border-blue-500 outline-none"
                        placeholder="Enter Current Password"
                    />
                    <button
                        type="button"
                        onClick={() => togglePassword("old")}
                        className="absolute right-4 top-3.5"
                    >
                        {showPassword.old ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                {errors.old_password && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.old_password}
                    </p>
                )}
            </div>

            {/* New Password */}
            <div className="mb-6">
                <label className="block mb-2 font-medium">
                    New Password
                </label>
                <div className="relative">
                    <input
                        type={showPassword.new ? "text" : "password"}
                        name="new_password"
                        value={formData.new_password}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-3 pr-12 focus:border-blue-500 outline-none"
                        placeholder="Enter New Password"
                    />
                    <button
                        type="button"
                        onClick={() => togglePassword("new")}
                        className="absolute right-4 top-3.5"
                    >
                        {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                {errors.new_password && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.new_password}
                    </p>
                )}
            </div>

            {/* Password Strength */}
            {formData.new_password && (
                <div className="mb-6">
                    <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-500">
                            Password Strength
                        </span>
                        <span className="text-sm font-medium">
                            {strength.text}
                        </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-200">
                        <div
                            className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
                            style={{ width: strength.width }}
                        />
                    </div>
                </div>
            )}

            {/* Confirm Password */}
            <div className="mb-6">
                <label className="block mb-2 font-medium">
                    Confirm Password
                </label>
                <div className="relative">
                    <input
                        type={showPassword.confirm ? "text" : "password"}
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-3 pr-12 focus:border-blue-500 outline-none"
                        placeholder="Confirm Password"
                    />
                    <button
                        type="button"
                        onClick={() => togglePassword("confirm")}
                        className="absolute right-4 top-3.5"
                    >
                        {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                {errors.confirm_password && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.confirm_password}
                    </p>
                )}
            </div>

            {/* Password Tips */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8">
                <h4 className="font-semibold mb-2">
                    Password Requirements
                </h4>
                <ul className="text-sm text-gray-600 space-y-1 list-disc ml-5">
                    <li>Minimum 8 characters recommended</li>
                    <li>Include uppercase letters</li>
                    <li>Include lowercase letters</li>
                    <li>Include numbers</li>
                    <li>Include special characters</li>
                </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => window.history.back()}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    loading={loading}
                >
                    Update Password
                </Button>
            </div>

        </form>
    );
}