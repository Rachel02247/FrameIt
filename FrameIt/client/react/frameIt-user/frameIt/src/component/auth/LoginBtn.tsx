import { Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginBtn = () => {
    const navigate = useNavigate();

    const goToSignUp = () => {
        navigate('/register');
    };

    const goToSignIn = () => {
        navigate('/login');
    };

    return (
        <>
        <p>hi btn</p>
         <Container>
         <Button variant="contained" color="primary" onClick={goToSignIn}>
                Go to Sign In
            </Button>
            <Button variant="contained" color="secondary" onClick={goToSignUp}>
                Go to Sign Up
            </Button>
        </Container> 
        </> 
    );
};

export default LoginBtn;
