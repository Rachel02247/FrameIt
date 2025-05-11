import { Outlet, useLocation } from "react-router-dom"

import NavBar from "./component/NavBar";
import Sidebar from "./component/sideBar";
import HomePage from "./component/homePage/homePage";
import Footer from "./component/homePage/footer";
import { useSelector } from "react-redux";
import { RootState } from "./component/global-states/store";

const AppLayout = () => {

    const location = useLocation()
    const isHomePage = location.pathname === '/';
    const isloginPage = location.pathname === '/register' || location.pathname === '/login';
    const user = useSelector((state: RootState) => state.user.user); 


    return (<>
        <NavBar />

        {isHomePage ?
            <>
                <HomePage />
            </>
            :

            !isloginPage && user && <Sidebar /> 

        }
        <Outlet />
        <Footer />
    </>)
}

export default AppLayout;