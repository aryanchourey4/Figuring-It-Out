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
    const [itemCost, setItemCost] = useState(0);
    const [itemQuantity, setItemQuantity] = useState(1);
    const [itemList, setItemList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const addItem = (e:any) => {
        e.preventDefault();
        if (itemName.trim() && itemCost > 0 && itemQuantity >= 1) {
          setItemList([...itemList,{itemName,itemCost,itemQuantity,},]);
        }
    
        setItemName("");
        setItemCost(0);
        setItemQuantity(0);
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
        console.log(data);
        dispatch(
            setInvoice({
                user_id: user.id,
                cashier_name:user.name,
                business_email:user.email,
                business_name:user.business_name,
                business_account_no:user.account_no,
                business_bank_name:user.bank_name,
                business_upi_id:user.upi_id,
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
            cashier_name:user.name,
            business_name:user.business_name,
            business_email:user.email,
            business_bank_name:user.bank_name,
            business_account_no:user.account_no,
            business_upi_id:user.upi_id,
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
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h5>Create an Invoice</h5>
                    <div>
                        <Input
                            id="customerName"
                            label="Customer Name"
                            disabled={isLoading}
                            register={register}
                            errors={errors}
                            required
                        />
                        <Input
                            id="customerEmail"
                            label="Customer Email"
                            disabled={isLoading}
                            register={register}
                            errors={errors}
                            required
                        />
                        <Input
                            id="customerAddress"
                            label="Customer Address"
                            disabled={isLoading}
                            register={register}
                            errors={errors}
                            required
                        />
                        <Input
                            id="customerCity"
                            label="Customer City"
                            disabled={isLoading}
                            register={register}
                            errors={errors}
                            required
                        />
                        <Input
                            id="currency"
                            label="Currency"
                            disabled={isLoading}
                            register={register}
                            errors={errors}
                            required
                        />
                        <div className="w-full flex justify-between flex-col">
                            <h3 className="my-4 font-bold ">Items List</h3>

                            <div className="flex space-x-3">
                                <div className="flex flex-col w-1/4">
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

                                <div className="flex flex-col w-1/4">
                                    <label
                                        htmlFor="itemCost"
                                        className="text-sm"
                                    >
                                        Cost
                                    </label>
                                    <input
                                        type="number"
                                        name="itemCost"
                                        placeholder="Cost"
                                        className="py-2 px-4 mb-6 bg-gray-100"
                                        // value={itemCost}
                                        onChange={(e) =>
                                            setItemCost(Number(e.target.value))
                                        }
                                    />
                                </div>

                                <div className="flex flex-col justify-center w-1/4">
                                    <label
                                        htmlFor="itemQuantity"
                                        className="text-sm"
                                    >
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        name="itemQuantity"
                                        placeholder="Quantity"
                                        className="py-2 px-4 mb-6 bg-gray-100"
                                        // value={itemQuantity}
                                        onChange={(e) =>
                                            setItemQuantity(Number(e.target.value))
                                        }
                                    />
                                </div>

                                <div className="flex flex-col justify-center w-1/4">
                                    <p className="text-sm">Price</p>
                                    <p className="py-2 px-4 mb-6 bg-gray-100">
                                        {Number(
                                            itemCost * itemQuantity
                                        ).toLocaleString("en-US")}
                                    </p>
                                </div>
                            </div>
                            <button
                                className="bg-blue-500 text-gray-100 w-[150px] p-3 rounded my-2"
                                onClick={addItem}
                            >
                                Add Item
                            </button>
                        </div>
                        {itemList[0] && (
                            <CreateInvoiceTable itemList={itemList} />
                        )}

                        <div>
                            <button type={"submit"}>Create Invoice</button>
                        </div>
                    </div>
                </form>
            )}
        </>
    );
};

export default CreateInvoice;
