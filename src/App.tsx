import './App.css';
import React, {lazy, Suspense} from "react"
import {Route, Routes} from "react-router-dom"
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PageNotFound from './pages/PageNotFound';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import CreateInvoice from './pages/CreateInvoice';
import ViewInvoice from './pages/ViewInvoice';
import SignUp from './pages/Signup';
import Invoices from './pages/Invoices';
import Navbar from './components/Navbar';
import AppUrlListener from './components/AppUrlListener';

// const Auth = lazy(()=> import('./pages/Auth'))
// const CreateInvoice = lazy(()=> import('./pages/CreateInvoice'))
// const Home = lazy(()=> import('./pages/Home'))
// const Dashboard = lazy(()=> import('./pages/Dashboard'))
// const SetupProfile = lazy(()=> import('./pages/SetupProfile'))


function App() {
  return (
    <div className="App">
      <AppUrlListener></AppUrlListener>
      <Navbar />
      {/* <Suspense fallback={<Loading/>}> */}
      <Routes>
        <Route path="/" element={<Dashboard />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<SignUp />}/>
        <Route path="/create_invoice" element={<CreateInvoice />}/>
        <Route path="/invoices" element={<Invoices />}/>
        <Route path="/view_invoice/:id" element={<ViewInvoice />}/>
        <Route path="*" element={<PageNotFound />}/>
        
      </Routes>
      {/* </Suspense> */}
      <ToastContainer />
       
    </div>
  );
}

export default App;
