import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { showToast } from "../utils/functions";
import { BiHomeAlt, BiPowerOff } from "react-icons/bi";

const Navbar = () => {
    const user = useAppSelector((state) => state.user.user);
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);
    useEffect(() => {
        user.id ? setLoggedIn(true) : setLoggedIn(false);
    }, [user.id]);

    const signOut = () => {
        window.location.reload();
        navigate("/");
        showToast("success", "Goodbye!👋");
    };
    return (
        <nav
            className="flex justify-between items-center px-8 h-16 bg-violet-200 text-black relative shadow-sm font-mono"
            role="navigation"
        >
            <div className="">INVOICE</div>
            <div className="flex justify-center items-center">
            <Link to="/" className="mx-8 ">
                <div className="flex justify-center items-center">
                    <BiHomeAlt size={24} className="text-neutral-700 mr-2"/>
                    Home
                </div>
            </Link>
            {loggedIn&&<button className="flex justify-center items-center" onClick={signOut}><BiPowerOff size={24} className="text-neutral-700 mr-2"/>Log Out</button>}
            </div>
        </nav>
    );
};

export default Navbar;
