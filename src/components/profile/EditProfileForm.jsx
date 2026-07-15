import { useEffect, useState } from "react";

import Input from "../common/Input";
import Button from "../common/Button";

export default function EditProfileForm({

    user,

    onSubmit,

    loading = false

}) {

    const [formData, setFormData] = useState({

        full_name: "",

        mobile: "",

        company_name: "",

        rera_number: "",

        address: "",

        city: "",

        state: "",

        country: "",

        pincode: "",

        profile_image: null

    });

    const [preview, setPreview] = useState("");

    useEffect(() => {

        if (user) {

            setFormData({

                full_name: user.full_name || "",

                mobile: user.mobile || "",

                company_name: user.company_name || "",

                rera_number: user.rera_number || "",

                address: user.address || "",

                city: user.city || "",

                state: user.state || "",

                country: user.country || "",

                pincode: user.pincode || "",

                profile_image: null

            });

            setPreview(user.profile_image || "");

        }

    }, [user]);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({

            ...prev,

            [name]: value

        }));

    };

    const handleImage = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setFormData((prev) => ({

            ...prev,

            profile_image: file

        }));

        setPreview(URL.createObjectURL(file));

    };

    return (

        <form className="bg-white rounded-xl shadow p-8">

            {/* Profile Image */}

            <div className="flex flex-col items-center mb-8">

                <img

                    src={
                        preview ||

                        "https://ui-avatars.com/api/?name=User"
                    }

                    alt="Profile"

                    className="
                        w-32
                        h-32
                        rounded-full
                        object-cover
                        border-4
                        border-blue-100
                    "

                />

                <label className="mt-4">

                    <span
                        className="
                            bg-blue-600
                            text-white
                            px-5
                            py-2
                            rounded-lg
                            cursor-pointer
                        "
                    >

                        Upload Image

                    </span>

                    <input

                        type="file"

                        hidden

                        accept="image/*"

                        onChange={handleImage}

                    />

                </label>

            </div>

            {/* Personal Details */}

            <div className="grid lg:grid-cols-2 gap-5">

                <Input

                    label="Full Name"

                    name="full_name"

                    value={formData.full_name}

                    onChange={handleChange}

                    required

                />

                <Input

                    label="Mobile"

                    name="mobile"

                    value={formData.mobile}

                    onChange={handleChange}

                    required

                />

                <Input

                    label="Company Name"

                    name="company_name"

                    value={formData.company_name}

                    onChange={handleChange}

                />

                <Input

                    label="RERA Number"

                    name="rera_number"

                    value={formData.rera_number}

                    onChange={handleChange}

                />

            </div>

            {/* Address Details */}

            <div className="grid lg:grid-cols-2 gap-5 mt-5">

                <Input
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                />

                <Input
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                />

                <Input
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                />

                <Input
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                />

                <Input
                    label="Pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                />

            </div>

            {/* Email */}

            <div className="mt-5">

                <Input
                    label="Email"
                    value={user?.email || ""}
                    disabled
                />

            </div>

            {/* Buttons */}

            <div className="flex justify-end gap-4 mt-8">

                <Button

                    variant="secondary"

                    type="button"

                    onClick={() => window.history.back()}

                >

                    Cancel

                </Button>

                <Button

                    type="submit"

                    loading={loading}

                    onClick={(e) => {

                        e.preventDefault();

                        const data = new FormData();

                        data.append(
                            "full_name",
                            formData.full_name
                        );

                        data.append(
                            "mobile",
                            formData.mobile
                        );

                        data.append(
                            "company_name",
                            formData.company_name
                        );

                        data.append(
                            "rera_number",
                            formData.rera_number
                        );

                        data.append(
                            "address",
                            formData.address
                        );

                        data.append(
                            "city",
                            formData.city
                        );

                        data.append(
                            "state",
                            formData.state
                        );

                        data.append(
                            "country",
                            formData.country
                        );

                        data.append(
                            "pincode",
                            formData.pincode
                        );

                        if (formData.profile_image) {

                            data.append(
                                "profile_image",
                                formData.profile_image
                            );

                        }

                        onSubmit(data);

                    }}

                >

                    Update Profile

                </Button>

            </div>

        </form>

    );

}