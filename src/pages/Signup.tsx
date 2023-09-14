import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { auth } from "../firebase";
import Input from "../components/Input";
import { useAppDispatch } from "../redux/hooks";
import { setUser } from "../redux/user";
import { showToast } from "../utils/functions";
import { addDoc, collection, serverTimestamp } from "@firebase/firestore";
import db from "../firebase";

const SignUp = ({ history }: any) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            business_name: "",
            bank_name: "",
            account_no: "",
            upi_id: "",
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data: any) => {
        setIsLoading(true);
        console.log(data);
        await createUserWithEmailAndPassword(auth, data.email, data.password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                await addDoc(collection(db, "users"), {
                    user_id: user.uid,
                    name: data.name,
                    email: user.email,
                    business_name: data.business_name,
                    account_no: data.account_no,
                    bank_name: data.bank_name,
                    upi_id: data.upi_id,
                });
                dispatch(
                    setUser({
                        id: user.uid,
                        email: user.email,
                        name: data.name,
                        business_name: data.business_name,
                        bank_name: data.bank_name,
                        account_no: data.account_no,
                        upi_id: data.upi_id,
                    })
                );
                showToast("success", "Congratulations!🚀");
                setIsLoading(false);
                navigate("/");
            })
            .catch((error) => {
                showToast("error", "Authentication Failed!😭");
                showToast("error", error.message);
                console.log(error);
            });
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h5>Create an account</h5>
                <div>
                    <Input
                        id="name"
                        label="Name"
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                        required
                    />
                    <Input
                        id="email"
                        label="Email"
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                        required
                    />
                    <Input
                        id="password"
                        label="Password"
                        type="password"
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                        required
                    />
                    <Input
                        id="business_name"
                        label="Business Name"
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                        required
                    />
                    <Input
                        id="account_no"
                        label="Bank Account Number"
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                        required
                    />
                    <Input
                        id="bank_name"
                        label="Bank Name"
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                        required
                    />
                    <Input
                        id="upi_id"
                        label="UPI ID"
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                        required
                    />

                    <div>
                        <button type={"submit"}>Create an account</button>
                    </div>
                </div>
            </form>
            <Link className="red-100" to="/login">
                Already have an account? Login.
            </Link>
        </>
    );
};

export default SignUp;
