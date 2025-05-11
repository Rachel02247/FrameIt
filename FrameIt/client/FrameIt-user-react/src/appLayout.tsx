import { Outlet, useLocation } from "react-router-dom"

import NavBar from "./component/NavBar";
import Sidebar from "./component/sideBar";
import HomePage from "./component/homePage/homePage";
import Footer from "./component/footer";

const AppLayout = () => {

    const location = useLocation()
    const isHomePage = location.pathname === '/';
    const isloginPage = location.pathname === '/register' || location.pathname === '/login';
    const userId = sessionStorage.getItem("id");


    return (<>
        <NavBar />

        {isHomePage ?
            <>
                <HomePage />
            </>
            :

            !isloginPage && userId && <Sidebar /> 

        }
        <Outlet />
        <Footer />
    </>)
}

export default AppLayout;