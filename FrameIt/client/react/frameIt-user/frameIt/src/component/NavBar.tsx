import { Button } from "@mui/material";
import { Link } from "react-router-dom";


export default () => {
    return (<>
        <nav style={{
            position: "absolute",
            top: "25px",
            left: "1%",
            width: '30%',
            display: "flex",
            justifyContent: 'space-around',
            textAlign: 'center',
            justifyItems: 'center',
            gap: '10px',
            fontSize: '20px',
            padding: "4px 8px",
            
        }}>
            <Link to='/'><img style={{width: 60}}src="img/frameItLogo.png" alt="logo" /></Link>
            <Link to='/Login'>
                <Button variant="contained" color="primary" >
                    Login
                </Button>
            </Link>
            <Link to='/home' >Home</Link>
            <Link to='/gallery' color="primary">Gallery</Link>

        </nav>
    </>);
}