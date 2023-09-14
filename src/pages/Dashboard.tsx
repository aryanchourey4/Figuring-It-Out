import React from 'react';
import { useAppSelector } from '../redux/hooks';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const user = useAppSelector((state) => state.user.user)
    return(
        <>
            {!user.id?
            <div className='flex flex-col justify-center items-center relative top-20'>
                <h1 className='text-[3rem] font-bold leading-3'>WELCOME TO</h1>
                <h1 className='text-[4rem] font-bold'>INVOICE</h1>
                <Link to="/login"><button className='h-auto w-48 mt-12 py-2 bg-violet-400 rounded-lg' type="button">LOG IN</button></Link>
                <Link to="/signup"><button className='h-auto w-48 mt-4 py-2 bg-violet-400 rounded-lg' type="button">SIGN UP</button></Link>
            </div>
            
            : 
            
            <div className='flex flex-col justify-center items-center relative top-20'>
                <h1 className='text-[3rem] font-bold leading-10'>
                    Welcome,
                </h1>
                <span className='text-violet-500 text-[3rem] font-bold'>{user.name}!</span>
                <Link to="/create_invoice"><button className='h-auto w-48 mt-12 py-2 bg-violet-400 rounded-lg' type="button">CREATE INVOICE</button></Link>
                <Link to="/invoices"><button className='h-auto w-48 mt-4 py-2 bg-violet-400 rounded-lg' type="button">ALL INVOICES</button></Link>
            </div>

            }
        </>
    );

};

export default Dashboard;