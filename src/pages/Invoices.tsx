import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import user from "../redux/user";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import db from "../firebase";

const Invoices = () => {
    const user = useAppSelector((state) => state.user.user);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const q = query(
                collection(db, "invoices"),
                where("user_id", "==", user.id)
            );
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const firebaseInvoices: any[] = [];
                querySnapshot.forEach((doc) => {
                    firebaseInvoices.push({ data: doc.data(), id: doc.id });
                });
                setInvoices(firebaseInvoices);
                setLoading(false);
                console.log(invoices);
                return () => unsubscribe();
            });
        } catch (error) {
            console.log(error);
        }
    }, [navigate, user.id]);

    return (
        <>
            {!user.id ? (
                navigate("/login")
            ) : (
                <>
                    <h1>All Invoices</h1>
                    <div>
                        {invoices.length !== 0 ? <Table invoices={invoices} /> : <span>No Invoices</span>}
                    </div>
                </>
            )}
        </>
    );
};

export default Invoices;
