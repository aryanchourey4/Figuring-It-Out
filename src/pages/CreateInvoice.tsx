import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import {
    query,
    collection,
    where,
    onSnapshot,
    addDoc,
    serverTimestamp,
} from "@firebase/firestore";
import db from "../firebase";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { setInvoice } from "../redux/invoice";
import { showToast } from "../utils/functions";
import CreateInvoiceTable from "../components/CreateInvoiceTable";

const CreateInvoice = () => {
    const user = useAppSelector((state) => state.user.user);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [itemName, setItemName] = useState("");
    const [itemCost, setItemCost] = useState("");
    const [itemQuantity, setItemQuantity] = useState("");
    const [itemList, setItemList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const addItem = (e: any) => {
        e.preventDefault();
        if (itemName.trim() && Number(itemCost) > 0 && Number(itemQuantity) >= 1) {
            setItemList([...itemList, { itemName, itemCost, itemQuantity }]);
        }

        setItemName("");
        setItemCost("");
        setItemQuantity("");
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            customerName: "",
            customerEmail: "",
            customerAddress: "",
            customerCity: "",
            currency: "",
            itemList: [],
        },
    });
    const onSubmit: SubmitHandler<FieldValues> = async (data: any) => {
        setIsLoading(true);
        dispatch(
            setInvoice({
                user_id: user.id,
                cashier_name: user.name,
                business_email: user.email,
                business_name: user.business_name,
                business_account_no: user.account_no,
                business_bank_name: user.bank_name,
                business_upi_id: user.upi_id,
                customerName: data.customerName,
                customerEmail: data.customerEmail,
                customerAddress: data.customerAddress,
                customerCity: data.customerCity,
                currency: data.currency,
                itemList: data.itemList,
            })
        );

        await addDoc(collection(db, "invoices"), {
            user_id: user.id,
            cashier_name: user.name,
            business_name: user.business_name,
            business_email: user.email,
            business_bank_name: user.bank_name,
            business_account_no: user.account_no,
            business_upi_id: user.upi_id,
            customerName: data.customerName,
            customerEmail: data.customerEmail,
            customerAddress: data.customerAddress,
            customerCity: data.customerCity,
            currency: data.currency,
            itemList: itemList,
            timestamp: serverTimestamp(),
        })
            .then(() => {
                showToast("success", "Invoice created!📜");
            })
            .then(() => navigate("/invoices"))
            .catch((err) => {
                showToast("error", "Try again! Invoice not created!😭");
            });
    };

    return (
        <>
            {!user.id ? (
                navigate("/")
            ) : (
                <form
                    className="flex flex-col justify-center items-center w-9/12]"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <h1 className="text-[3rem] font-bold leading-relaxed m-6 flex flex-wrap mt-12 justify-center items-center">
                        CREATE AN INVOICE
                    </h1>
                    <div className="flex flex-col justify-center items-center mt-6 w-11/12">
                        <Input
                            id="customerName"
                            label="Customer Name"
                            disabled={isLoading}
                            register={register}
                            errors={errors}
                            required
                        />
                        <br />
                        <Input
                            id="customerEmail"
                            label="Customer Email"
                            disabled={isLoading}
                            register={register}
                            errors={errors}
                            required
                        />
                        <br />
                        <Input
                            id="customerAddress"
                            label="Customer Address"
                            disabled={isLoading}
                            register={register}
                            errors={errors}
                            required
                        />
                        <br />
                        <Input
                            id="customerCity"
                            label="Customer City"
                            disabled={isLoading}
                            register={register}
                            errors={errors}
                            required
                        />
                        <br />
                        <Input
                            id="currency"
                            label="Currency"
                            disabled={isLoading}
                            register={register}
                            errors={errors}
                            required
                        />
                        <br />
                        <div className="w-11/12 flex justify-between flex-col">
                            <h3 className="my-4 font-bold ">Items List</h3>

                            <div className="w-full flex flex-col space-y-3">
                                <div className="w-full flex flex-col">
                                    <label
                                        htmlFor="itemName"
                                        className="text-sm"
                                    >
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="itemName"
                                        placeholder="Name"
                                        className="py-2 px-4 mb-6 bg-gray-100"
                                        value={itemName}
                                        onChange={(e) =>
                                            setItemName(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="w-full flex flex-col">
                                    <label
                                        htmlFor="itemCost"
                                        className="text-sm"
                                    >
                                        Cost
                                    </label>
                                    <input
                                        type="text"
                                        name="itemCost"
                                        placeholder="Cost"
                                        className="py-2 px-4 mb-6 bg-gray-100"
                                        value={itemCost}
                                        onChange={(e) =>
                                            setItemCost(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="w-full flex flex-col">
                                    <label
                                        htmlFor="itemQuantity"
                                        className="text-sm"
                                    >
                                        Quantity
                                    </label>
                                    <input
                                        type="text"
                                        name="itemQuantity"
                                        placeholder="Quantity"
                                        className="py-2 px-4 mb-6 bg-gray-100"
                                        value={itemQuantity}
                                        onChange={(e) =>
                                            setItemQuantity(
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>

                                <div className="w-full flex flex-col">
                                    <label
                                        htmlFor="itemsPrice"
                                        className="text-sm"
                                    >
                                        Price
                                    </label>
                                    <input
                                        className="py-2 px-4 mb-6 bg-gray-100"
                                        type="number"
                                        name="Price"
                                        id="price"
                                        disabled
                                        readOnly
                                        value={Number(itemCost) * Number(itemQuantity)}
                                    />
                                </div>
                                <div>
                                    <button
                                        className="h-auto w-48 mt-2 py-2 bg-violet-400 rounded-lg mb-10"
                                        onClick={addItem}
                                    >
                                        Add Item
                                    </button>
                                </div>
                            </div>
                        </div>
                        <CreateInvoiceTable itemList={itemList} />

                        <div className="my-10">
                            <button
                                className="h-auto w-48 mt-2 py-2 bg-violet-400 rounded-lg"
                                type={"submit"}
                            >
                                Create Invoice
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </>
    );
};

export default CreateInvoice;
