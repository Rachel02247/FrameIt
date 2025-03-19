/* eslint-disable react-refresh/only-export-components */
import { Link } from "react-router-dom";


export default () => {

    return (<>
        <Link to='/home'><img style={{ width: 50, top: 20, right: 40, position: 'absolute' , zIndex: 2}} src="img/logo.png" alt="logo" /></Link>
    </>);
}