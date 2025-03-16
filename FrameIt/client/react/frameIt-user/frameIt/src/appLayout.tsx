import { Outlet } from "react-router-dom"
import NavBar from "./component/NavBar"
import Menu from "./component/menu"

export default () => {

    return (<>
        <Menu />
        <NavBar />
        <Outlet />
     
    </>)
}