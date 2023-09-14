import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Input from "../components/Input";
import { query, collection, where, onSnapshot } from "@firebase/firestore";
import db from "../firebase";
import { useAppDispatch } from "../redux/hooks";
import { setUser } from "../redux/user";
import { showToast } from "../utils/functions";

const Login = ({ history }: any) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data: any) => {
        setIsLoading(true);
        console.log(data);
        await signInWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) => {
                const user = userCredential.user;
                try {
                    const q = query(
                        collection(db, "users"),
                        where("user_id", "==", user.uid)
                    );
                    const unsubscribe = onSnapshot(q, (querySnapshot) => {
                        const firebaseUser: any[] = [];
                        querySnapshot.forEach((doc) => {
                            firebaseUser.push({
                                name: doc.data().name,
                                business_name: doc.data().business_name,
                                account_no: doc.data().account_no,
                                bank_name: doc.data().bank_name,
                                upi_id: doc.data().upi_id,
                            });
                        });
                        dispatch(
                            setUser({
                                id: user.uid,
                                email: user.email,
                                name: firebaseUser[0].name,
                                business_name: firebaseUser[0].business_name,
                                bank_name: firebaseUser[0].bank_name,
                                account_no: firebaseUser[0].account_no,
                                upi_id: firebaseUser[0].upi_id,
                            })
                        );

                        return () => unsubscribe();
                    });
                    console.log(q);
                } catch (error) {
                    console.log(error);
                }
            })
            .then(() => {
                showToast("success", "Congratulations!🚀");
                setIsLoading(false);
                navigate("/");
            })
            .catch((error) => {
                showToast("error", "Authentication Failed!😭");
                showToast("error", error.message);
                console.log(error);
                setIsLoading(false);
            });
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h5>Login</h5>
                <div>
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

                    <div>
                        <button type={"submit"}>Login</button>
                    </div>
                </div>
            </form>
            <Link className="red-100" to="/signup">
                Don't have an account? Create an account.
            </Link>
        </>
    );
};

export default Login;
