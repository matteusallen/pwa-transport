import { Button } from "@mui/base"
import truckyuLogo from "../../../src/assets/images/truck-nav-logo.svg"
import { useState } from "react";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import {  useAuthState } from "../../contexts/AuthContext";

export default function AdminTopBar() {
    const [showLogout, setShowLogout] = useState(false);
    const { user } = useAuthState();
    const { dispatch } = useAuthState();

    const handleLogout = (e: any) => {
        e.preventDefault();
        dispatch({ type: 'LOGOUT' });
    }

    return (
        <header className="flex justify-between bg-white items-center px-4 md:px-7 border-solid border-b relative">
            <div className="logo">
                <img src={truckyuLogo} alt="logo" />
            </div>
            <div className="text-sm text-slate-600">
                <Button onClick={() => setShowLogout(!showLogout)} className="flex">{user?.givenName} {user?.familyName.charAt(0)}. {showLogout ? <IconChevronUp className="w-2" /> : <IconChevronDown className="w-2" />}</Button>
                {showLogout && <a className="absolute px-2 py-1 border border-solid border-slate-200 bg-white" onClick={handleLogout}>Logout</a>}
            </div>
        </header>
    )
}