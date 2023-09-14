import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
    query,
    collection,
    where,
    doc,
    onSnapshot,
    getDoc,
} from "@firebase/firestore";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import db from "../firebase";

const ViewInvoice = () => {
    let params = useParams();
    const [invoiceDetails, setInvoiceDetails] = useState<any>({});
    const [businessDetails, setBusinessDetails] = useState<any>({});
    const user = useAppSelector((state) => state.user.user);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            if (params.id === undefined) {
                navigate("/invoices");
            } else {
                const q = query(collection(db, "invoices"));
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const firebaseInvoices: any[] = [];
                    querySnapshot.forEach((doc) => {
                        if(doc.id===params.id){firebaseInvoices.push({ data: doc.data(), id: doc.id });}
                    });
                    console.log(firebaseInvoices);
                    setInvoiceDetails(firebaseInvoices[0]);
                    return () => unsubscribe();
                });
                
            }
        } catch (error) {
            console.error(error);
        }
    }, [params.id, navigate, user.id]);

    return (
        <>
            {
                !invoiceDetails.data?navigate("*")
                
                :
            <>
                View Invoice
                <div>{params.id}</div>
                <div>{invoiceDetails.data.customerName}</div></>
            }
        </>
    );
};

export default ViewInvoice;
