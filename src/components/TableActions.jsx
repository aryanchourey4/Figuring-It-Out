import React from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, deleteDoc } from 'firebase/firestore';
import db from '../firebase';
import { showToast } from '../utils/functions';
import { BiReceipt, BiTrash } from 'react-icons/bi';

const TableActions = ({ invoiceId }) => {
  const navigate = useNavigate();

  async function deleteInvoice(id) {
    try {
      await deleteDoc(doc(db, 'invoices', id));
      showToast("success", 'Deleted successfully!')
    } catch (err) {
      showToast("error", 'Failed, Try again!')
    }
  }

  return (
    <div className="flex items-center justify-center space-x-3">
      <button className='text-violet-500 flex justify-center items-center'  onClick={() => navigate(`/view_invoice/${invoiceId}`)} type="button"><BiReceipt size={20} className=""/></button>
      <button className='text-red-500 flex justify-center items-center' onClick={() => deleteInvoice(invoiceId)} type="button"><BiTrash size={20} className=""/></button>
    </div>
  );
};

export default TableActions;