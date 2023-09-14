import React from 'react';
import { useAppSelector } from '../redux/hooks';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const user = useAppSelector((state) => state.user.user)
    return(
        <>
            {!user.id?
            <div>
                <h1>Welcome to Invoice.</h1>
                <Link to="/login">Login</Link>
                <Link to="/signup">Sign Up</Link>
            </div>
            
            : 
            
            <div>
                <h1>
                    Welcome {user.name}
                </h1>
                <Link to="/create_invoice">Create Invoice</Link>
                <Link to="/invoices">All Invoices</Link>
            </div>

            }
        </>
    );

};

export default Dashboard;