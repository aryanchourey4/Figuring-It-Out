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
              JSON.stringify(invoiceData.itemList) || "", // Convert itemList to JSON string
              convertTimestamp(invoiceData.timestamp) || "", // Convert timestamp to a formatted date string
            ]);

            setCsvData(newCsvData);
          }

          console.log(firebaseInvoices);
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
      <table>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Item Description</th>
            <th>Item Cost</th>
            <th>Item Quantity</th>
          </tr>
        </thead>
        <tbody>
          {invoiceDetails.data.itemList.map((item: any, index: number) => (
            <tr key={index}>
              <td>{item.itemName}</td>
              <td>{item.itemDescription}</td>
              <td>{item.itemCost}</td>
              <td>{item.itemQuantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
      <form>
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
      </form>
    );
  };

  return (
    <div>
      {!loading ? (
        invoiceDetails ? (
          <>
            <h2>View Invoice</h2>
            <div>Invoice ID: {id}</div>
            {renderInvoiceForm()}
            {renderInvoiceTable()}
            <CSVLink
              data={csvData}
              filename={"invoice.csv"}
              className="btn btn-primary"
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
    <button id="downloadPDF" onClick={downloadPdf}>Download PDF</button>
    <button id="Copy" onClick={Copy}>Copy URL</button>

    </div>
  );
};

export default ViewInvoice;
