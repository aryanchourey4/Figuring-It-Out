import React from 'react';
import TableActions from './TableActions';
import { convertTimestamp } from '../utils/functions';

const Table = ({ invoices }:any) => {
  return (
    <div className="w-full">
      <h3 className="text-xl text-blue-700 font-semibold">Recent Invoices </h3>
      <table>
        <thead>
          <tr>
            <th className="text-blue-600">Date</th>
            <th  className="text-blue-600">Customer</th>
            <th  className="text-blue-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice:any) => (
            <tr key={invoice.id}>
              <td className='text-sm text-gray-400'>{convertTimestamp(invoice.data.timestamp)}</td>
              <td  className='text-sm'>{invoice.data.customerName}</td>
              <td>
                <TableActions invoiceId={invoice.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;