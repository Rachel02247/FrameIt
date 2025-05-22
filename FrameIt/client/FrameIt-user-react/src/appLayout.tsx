import { Outlet, useLocation } from "react-router-dom"
<<<<<<< HEAD
=======
import { useSelector } from "react-redux";
>>>>>>> clean-dev

import NavBar from "./component/NavBar";
import Sidebar from "./component/sideBar";
import HomePage from "./component/homePage/homePage";
import Footer from "./component/footer";
<<<<<<< HEAD

const AppLayout = () => {

    const location = useLocation()
    const isHomePage = location.pathname === '/';
    const isloginPage = location.pathname === '/register' || location.pathname === '/login';
    const userId = sessionStorage.getItem("id");
=======
import { selectAuth } from "./component/global-states/userSlice";

const AppLayout = () => {

    
    const location = useLocation()
    const isHomePage = location.pathname === '/';
    const isloginPage = location.pathname === '/register' || location.pathname === '/login';
    const isAuthenticated = useSelector(selectAuth);
    const userId = sessionStorage.getItem("id") || isAuthenticated;
>>>>>>> clean-dev


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