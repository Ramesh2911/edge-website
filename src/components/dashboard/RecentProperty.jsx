import {
    Eye,
    SquarePen,
    MapPin,
    IndianRupee
} from "lucide-react";

import { Link } from "react-router-dom";

export default function RecentProperty({

    properties = [],

    showEdit = true

}) {

    return (

        <div className="bg-white rounded-xl shadow p-6">

            {/* Header */}

            <div className="flex justify-between items-center mb-6">

                <h2 className="text-xl font-semibold">

                    Recent Properties

                </h2>

                <Link

                    to="/my-properties"

                    className="text-blue-600 hover:underline"

                >

                    View All

                </Link>

            </div>

            {/* Empty */}

            {

                properties.length === 0 && (

                    <div className="text-center py-10">

                        <p className="text-gray-500">

                            No Properties Found

                        </p>

                    </div>

                )

            }

            {/* Table */}

            {

                properties.length > 0 && (

                    <div className="overflow-x-auto">

                        <table className="min-w-full">

                            <thead>

                                <tr className="border-b">

                                    <th className="text-left py-3">

                                        Property

                                    </th>

                                    <th>

                                        Type

                                    </th>

                                    <th>

                                        Price

                                    </th>

                                    <th>

                                        Status

                                    </th>

                                    <th>

                                        Action

                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    properties.map((item) => (

                                        <tr

                                            key={item.id}

                                            className="border-b hover:bg-gray-50"

                                        >

                                            {/* Property */}

                                            <td className="py-4">

                                                <div className="flex items-center gap-3">

                                                    <img

                                                        src={item.image}

                                                        alt={item.title}

                                                        className="w-20 h-16 rounded-lg object-cover"

                                                    />

                                                    <div>

                                                        <h4 className="font-semibold">

                                                            {item.title}

                                                        </h4>

                                                        <p className="text-sm text-gray-500 flex items-center gap-1">

                                                            <MapPin size={14} />

                                                            {item.city}

                                                        </p>

                                                    </div>

                                                </div>

                                            </td>

                                            {/* Type */}

                                            <td>

                                                <div>

                                                    <p>

                                                        {item.property_type}

                                                    </p>

                                                    <span className="text-xs text-gray-500">

                                                        {item.property_for}

                                                    </span>

                                                </div>

                                            </td>

                                            {/* Price */}

                                            <td>

                                                <div className="flex items-center justify-center">

                                                    <IndianRupee size={16} />

                                                    <span>

                                                        {item.price}

                                                    </span>

                                                </div>

                                            </td>

                                            {/* Status */}

                                            <td>

                                                <span

                                                    className={`

                                                    px-3

                                                    py-1

                                                    rounded-full

                                                    text-sm

                                                    font-medium

                                                    ${item.status === "Approved"

                                                            ? "bg-green-100 text-green-700"

                                                            : item.status === "Pending"

                                                                ? "bg-yellow-100 text-yellow-700"

                                                                : "bg-red-100 text-red-700"

                                                        }

                                                    `}

                                                >

                                                    {item.status}

                                                </span>

                                            </td>

                                            {/* Action */}

                                            <td>

                                                <div className="flex justify-center gap-2">

                                                    <Link

                                                        to={`/properties/details/${item.id}`}

                                                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition"

                                                    >

                                                        <Eye size={18} />

                                                    </Link>

                                                    {

                                                        showEdit && (

                                                            <Link

                                                                to={`/edit-property/${item.id}`}

                                                                className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition"

                                                            >

                                                                <SquarePen size={18} />

                                                            </Link>

                                                        )

                                                    }

                                                </div>

                                            </td>

                                        </tr>

                                    ))

                                }

                            </tbody>

                        </table>

                    </div>

                )

            }

        </div>

    );

}