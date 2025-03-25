import { Outlet, useLocation } from "react-router-dom"

import NavBar from "./component/NavBar";
import AccountMenu from "./component/account/accountMenu";
import Sidebar from "./component/sideBar";
import HomePage from "./component/homePage/homePage";
import AddFiles from "./page/upload/try";

const AppLayout = () => {

    const location = useLocation()
    const isHomePage = location.pathname === '/';


    return (<>
        <NavBar />

        {isHomePage ?
            <>
                <HomePage />
            </>
            :

            <Sidebar />

        }
        <Outlet />
    </>)
}

export default AppLayout;