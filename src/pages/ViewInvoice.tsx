import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  query,
  collection,
  onSnapshot,
  DocumentData,
  QueryDocumentSnapshot,
} from "@firebase/firestore";
import db from "../firebase";
import { showToast } from "../utils/functions";
import generatePDF,{Options} from 'react-to-pdf';
import { CSVLink } from "react-csv";
import { convertTimestamp } from "../utils/functions";
import { EmailComposer } from "capacitor-email-composer";
import { isPlatform } from "@ionic/react";



const ViewInvoice = () => {
  const { id } = useParams();
  const [invoiceDetails, setInvoiceDetails] = useState<any>({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false); 

  const options: Options = {
    filename: "Invoice.pdf",
    page: {
      margin: 0
    }
  };


  const sendEmail = () => {
    const content = `Business Name:${invoiceDetails.business_name}, Customer Name:${invoiceDetails.customerName}, Customer Address:${invoiceDetails.customerAddress} Customer City:${invoiceDetails.customerCity} Currency:${invoiceDetails.currency} Item List:${invoiceDetails.itemList}`;
    const emailComposer=EmailComposer;
    emailComposer.open({
      to: [`${invoiceDetails.customerEmail}`],
      cc: [`${invoiceDetails.customerEmail}`],
      bcc: [`${invoiceDetails.customerEmail}`, `${invoiceDetails.customerEmail}`],
      attachments: [],
      subject: "Invoice",
      body: content,
      isHtml: true,

    })
  };

  
  const getTargetElement = () => document.getElementById("invoice");
  
  const downloadPdf = () => {
    generatePDF(getTargetElement, options);
    showToast("success", "Download Started! 😃");

  };
  const Copy = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopied(true);
        showToast("success", "Link Copied! 😃");
      })
      .catch((error) => {
        showToast("error", "Error in Copying Link 😔");
      });
  };

  const [csvData, setCsvData] = useState<any[]>([]);

  useEffect(() => {
    try {
      if (!id) {
        navigate("/invoices");
      } else {
        const q = query(collection(db, "invoices"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const firebaseInvoices: any[] = [];
          querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
            if (doc.id === id) {
              firebaseInvoices.push({ data: doc.data() as any, id: doc.id });
            }
          });

          if (firebaseInvoices[0]) {
            const invoiceData = firebaseInvoices[0].data;

            const newCsvData: any[] = [];
            newCsvData.push([
              "User ID",
              "Cashier Name",
              "Business Email",
              "Business Name",
              "Business Bank Name",
              "Business Account No",
              "Business UPI ID",
              "Customer Name",
              "Customer Email",
              "Customer Address",
              "Customer City",
              "Currency",
              "Item List",
              "Timestamp",
            ]);
            newCsvData.push([
              invoiceData.user_id || "",
              invoiceData.cashier_name || "",
              invoiceData.business_email || "",
              invoiceData.business_name || "",
              invoiceData.business_bank_name || "",
              invoiceData.business_account_no || "",
              invoiceData.business_upi_id || "",
              invoiceData.customerName || "",
              invoiceData.customerEmail || "",
              invoiceData.customerAddress || "",
              invoiceData.customerCity || "",
              invoiceData.currency || "",
              JSON.stringify(invoiceData.itemList) || "", 
              convertTimestamp(invoiceData.timestamp) || "", 
            ]);

            setCsvData(newCsvData);
          }

          setInvoiceDetails(firebaseInvoices[0] || null);
          setLoading(false);
        });

        return () => unsubscribe();
      }
    } catch (error) {
      console.error(error);
    }
  }, [id, navigate]);

  const renderInvoiceTable = () => {
    if (
      !invoiceDetails ||
      !invoiceDetails.data ||
      !invoiceDetails.data.itemList
    ) {
      return null;
    }

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
                    {invoiceDetails.data.itemList.reverse().map((item: any) => (
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

  const renderInvoiceForm = () => {
    if (!invoiceDetails || !invoiceDetails.data) {
      return null;
    }

    const {
      user_id,
      cashier_name,
      business_email,
      business_name,
      business_account_no,
      business_bank_name,
      business_upi_id,
      customerName,
      customerEmail,
      customerAddress,
      customerCity,
      currency,
      itemList,
      timestamp,
    } = invoiceDetails.data;

    return (
      <div className="flex flex-col justify-center items-center">
        <div>
          <label>Date:</label>
          <input type="text" value={convertTimestamp(timestamp)} readOnly />
        </div>
        <div>
          <label>User ID:</label>
          <input type="text" value={user_id || ""} readOnly />
        </div>
        <div>
          <label>Cashier Name:</label>
          <input type="text" value={cashier_name || ""} readOnly />
        </div>
        <div>
          <label>Business Email:</label>
          <input type="text" value={business_email || ""} readOnly />
        </div>
        <div>
          <label>Business Name:</label>
          <input type="text" value={business_name || ""} readOnly />
        </div>
        <div>
          <label>Business Account No:</label>
          <input type="text" value={business_account_no || ""} readOnly />
        </div>
        <div>
          <label>Business Bank Name:</label>
          <input type="text" value={business_bank_name || ""} readOnly />
        </div>
        <div>
          <label>Business UPI ID:</label>
          <input type="text" value={business_upi_id || ""} readOnly />
        </div>
        <div>
          <label>Customer Name:</label>
          <input type="text" value={customerName || ""} readOnly />
        </div>
        <div>
          <label>Customer Email:</label>
          <input type="text" value={customerEmail || ""} readOnly />
        </div>
        <div>
          <label>Customer Address:</label>
          <input type="text" value={customerAddress || ""} readOnly />
        </div>
        <div>
          <label>Customer City:</label>
          <input type="text" value={customerCity || ""} readOnly />
        </div>
        <div>
          <label>Currency:</label>
          <input type="text" value={currency || ""} readOnly />
        </div>
      </div>
    );
  };

  return (
    <div>
      {!loading ? (
        invoiceDetails ? (
          <>
            <h1 className="text-[3rem] font-bold leading-relaxed flex flex-wrap mt-12 justify-center items-center">
                    VIEW INVOICE
                </h1>
            <div id="invoice">
            <div className="mb-6">Invoice ID: {id}</div>
            {renderInvoiceForm()}
            {renderInvoiceTable()}
            </div>
            <CSVLink
              data={csvData}
              filename={"invoice.csv"}
              className="h-auto w-full mt-2 py-2 px-12 mb-2 bg-violet-400 rounded-lg"
              target="_blank"
            >
              Export to CSV
            </CSVLink>
          </>
        ) : (
          <div>Invoice not found</div>
        )
      ) : (
        <div>Loading...</div>
      )}
      <div className="flex flex-col justify-center items-center">
    <button className="h-auto w-48 mt-2 py-2 bg-violet-400 rounded-lg" id="downloadPDF" onClick={downloadPdf}>Download PDF</button>
    <button className="h-auto w-48 mt-2 py-2 bg-violet-400 rounded-lg" id="Copy" onClick={Copy}>Copy URL</button>
    <button className="h-auto w-48 mt-2 py-2 bg-violet-400 rounded-lg" id="Email" onClick={sendEmail}>Email</button>
</div>
    </div>
  );
};

export default ViewInvoice;
