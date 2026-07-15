import {
    Mail,
    Phone,
    MapPin,
    Building2,
    BadgeCheck,
    User,
    SquarePen
} from "lucide-react";

import { Link } from "react-router-dom";

export default function ProfileCard({

    user,

    showEdit = true

}) {

    if (!user) return null;

    return (

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">

            {/* Cover */}

            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

            {/* Profile */}

            <div className="px-8 pb-8">

                <div className="-mt-16 flex flex-col lg:flex-row lg:items-end lg:justify-between">

                    <div className="flex flex-col lg:flex-row items-center lg:items-end gap-5">

                        <img

                            src={
                                user.profile_image ||
                                "https://ui-avatars.com/api/?name=" +
                                user.full_name
                            }

                            alt={user.full_name}

                            className="
                                w-32
                                h-32
                                rounded-full
                                border-4
                                border-white
                                object-cover
                                shadow-lg
                            "

                        />

                        <div>

                            <h2 className="text-3xl font-bold">

                                {user.full_name}

                            </h2>

                            <p className="text-gray-500 mt-1">

                                {user.role_name}

                            </p>

                        </div>

                    </div>

                    {

                        showEdit && (

                            <Link

                                to="/update-profile"

                                className="
                                    mt-6
                                    lg:mt-0
                                    inline-flex
                                    items-center
                                    gap-2
                                    bg-blue-600
                                    hover:bg-blue-700
                                    text-white
                                    px-5
                                    py-3
                                    rounded-xl
                                    transition
                                "

                            >

                                <SquarePen size={18} />

                                Edit Profile

                            </Link>

                        )

                    }

                </div>

                {/* Details */}

                <div className="grid md:grid-cols-2 gap-6 mt-10">

                    <div className="flex gap-4">

                        <Mail className="text-blue-600" />

                        <div>

                            <p className="text-gray-500">

                                Email

                            </p>

                            <h4>

                                {user.email}

                            </h4>

                        </div>

                    </div>

                    <div className="flex gap-4">

                        <Phone className="text-blue-600" />

                        <div>

                            <p className="text-gray-500">

                                Mobile

                            </p>

                            <h4>

                                {user.mobile}

                            </h4>

                        </div>

                    </div>

                    <div className="flex gap-4">

                        <Building2 className="text-blue-600" />

                        <div>

                            <p className="text-gray-500">

                                Company

                            </p>

                            <h4>

                                {

                                    user.company_name ||

                                    "-"

                                }

                            </h4>

                        </div>

                    </div>

                    <div className="flex gap-4">

                        <BadgeCheck className="text-blue-600" />

                        <div>

                            <p className="text-gray-500">

                                RERA Number

                            </p>

                            <h4>

                                {

                                    user.rera_number ||

                                    "-"

                                }

                            </h4>

                        </div>

                    </div>

                    <div className="flex gap-4 md:col-span-2">

                        <MapPin className="text-blue-600" />

                        <div>

                            <p className="text-gray-500">

                                Address

                            </p>

                            <h4>

                                {user.address},

                                {" "}

                                {user.city},

                                {" "}

                                {user.state},

                                {" "}

                                {user.country}

                                {" - "}

                                {user.pincode}

                            </h4>

                        </div>

                    </div>

                </div>

                {/* Status */}

                <div className="mt-10 flex gap-3 flex-wrap">

                    <span

                        className={`
                            px-4
                            py-2
                            rounded-full
                            text-sm
                            font-medium
                            ${user.status === 1
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }
                        `}

                    >

                        {

                            user.status === 1

                                ?

                                "Active"

                                :

                                "Inactive"

                        }

                    </span>

                    <span

                        className={`
                            px-4
                            py-2
                            rounded-full
                            text-sm
                            font-medium
                            ${user.is_verified === 1
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                            }
                        `}

                    >

                        {

                            user.is_verified === 1

                                ?

                                "Verified"

                                :

                                "Pending Verification"

                        }

                    </span>

                </div>

            </div>

        </div>

    );

}