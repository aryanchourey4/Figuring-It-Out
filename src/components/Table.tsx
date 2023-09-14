import React from "react";
import TableActions from "./TableActions";
import { convertTimestamp } from "../utils/functions";

const Table = ({ invoices }: any) => {
    return (
        <div className="w-full p-6 flex flex-col justify-center items-center">
            <table className="table-fixed border-fixed  border-white w-[98%] border-2 rounded-lg">
                <thead>
                    <tr>
                        <th className="text-violet-800 border-white border-2 bg-violet-300 p-6">Date</th>
                        <th className="text-violet-800 border-white border-2 bg-violet-300 p-6">Customer</th>
                        <th className="text-violet-800 border-white border-2 bg-violet-300 p-6">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice: any) => (
                        <tr key={invoice.id}>
                            <td className="text-sm text-gray-400 border-white border-2 bg-violet-100 p-2 overflow-x-scroll">
                                {convertTimestamp(invoice.data.timestamp)}
                            </td>
                            <td className="text-sm border-white border-2 bg-violet-100 p-2 overflow-x-scroll">
                                {invoice.data.customerName}
                            </td>
                            <td className="border-white border-2 bg-violet-100 p-2 overflow-x-scroll">
                                <TableActions invoiceId={invoice.id} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
