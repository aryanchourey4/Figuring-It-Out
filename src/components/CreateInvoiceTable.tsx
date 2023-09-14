import React from "react";

const CreateInvoiceTable = ({ itemList }: any) => {
    return (
        <div className="w-full p-6 flex flex-col justify-center items-center">
            <table className="table-fixed border-fixed  border-white w-[98%] border-2 rounded-lg">
                <thead>
                    <tr>
                        <th className="text-violet-800 border-white border-2 bg-violet-300 px-2 py-6">Name</th>
                        <th className="text-violet-800 border-white border-2 bg-violet-300 px-2 py-6">Cost</th>
                        <th className="text-violet-800 border-white border-2 bg-violet-300 px-2 py-6">Quantity</th>
                        <th className="text-violet-800 border-white border-2 bg-violet-300 px-2 py-6">Amount</th>
                    </tr>
                </thead>

                <tbody>
                    {itemList.reverse().map((item: any) => (
                        <tr key={item.itemName}>
                            <td className="text-sm border-white border-2 bg-violet-100 p-2 overflow-x-scroll">{item.itemName}</td>
                            <td className="text-sm border-white border-2 bg-violet-100 p-2 overflow-x-scroll">{item.itemCost}</td>
                            <td className="text-sm border-white border-2 bg-violet-100 p-2 overflow-x-scroll">{item.itemQuantity}</td>
                            <td className="text-sm border-white border-2 bg-violet-100 p-2 overflow-x-scroll">
                                {Number(
                                    item.itemCost * item.itemQuantity
                                ).toLocaleString("en-US")}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CreateInvoiceTable;
