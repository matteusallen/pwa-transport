import { useState } from "react";
import coin from '../../assets/images/coin.svg'
import {  useAuthState } from "../../contexts/AuthContext";

export default function UserTopBar({pageTitle}: { pageTitle: string}) {
    const [showLogout, setShowLogout] = useState(false);
    const { user } = useAuthState();    
    const { dispatch } = useAuthState();

    const handleLogout = (e: any) => {
        e.preventDefault();
        dispatch({ type: 'LOGOUT' });
    }

    return (
        <header className="flex justify-between bg-white items-center px-3 border-solid border-b py-2.5">
            <div onClick={() => setShowLogout(!showLogout)} className="user-icon text-xs bg-primary-400 border border-black border-solid rounded-full h-4 w-4 flex items-center justify-center">{`${user?.givenName?.charAt(0)}${user?.familyName?.charAt(0)}`}</div>
            {showLogout && <a className="absolute px-2 py-1 top-7 border border-solid border-slate-300 bg-white" onClick={handleLogout}>Logout</a>}
            <div className="ut-bar__page-title text-sm text-slate-600 relative">
               <h3 className="text-2xl font-bold">{pageTitle}</h3>
            </div>
            <div className="flex flex-row">
                <span>{user?.rewards} pts</span>
                <img src={coin} />
            </div>
        </header>
    )
}