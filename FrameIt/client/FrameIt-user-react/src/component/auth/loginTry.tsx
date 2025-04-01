import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    CircularProgress,
    FormHelperText,
    Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../global-states/store';
import { login } from '../../global-states/userSlice';

// Custom styled components
const LogoRing = styled(Box)(({ theme }) => ({
    width: 250,
    height: 250,
    border: `25px solid ${theme.palette.error.main}`,
    borderRadius: '50%',
    position: 'relative',
    margin: '0 auto 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const LoginTry = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const [formError, setFormError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
        setFormError(null);
    };

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!credentials.email || !credentials.password) {
            setFormError("You have to fill all the fields");
            return;
        }

        try {
            const resultAction = await dispatch(login(credentials));
            sessionStorage.setItem('token', resultAction.payload?.token);
            sessionStorage.setItem('name', resultAction.payload?.user.name);

            if (login.fulfilled.match(resultAction)) {
                navigate("/myWorkspace");
            }
        } catch (err) {
            setFormError("Login error, please try again");
            console.log(err);
        }
    };

    return (
        <Paper sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgb(255, 255, 255)' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', p: 3 }}>
                <Container maxWidth="sm">
                    <LogoRing sx={{ border: '25px solid #e60060'! }}>
                        <Typography variant="h4" component="div" align="center" color='primary' sx={{ position: 'absolute', width: '100%', fontWeight: 'bold', textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
                            Welcome <br /> Back!
                        </Typography>
                    </LogoRing>
                    <Typography variant="h4" component="h1" mb={4}>
                        Login to Your Account
                    </Typography>
                </Container>
                <Container maxWidth="sm">
                    <Paper elevation={0} sx={{ width: '100%', bgcolor: 'transparent', p: 2 }}>
                        <form onSubmit={handleLogin}>
                            <TextField fullWidth name="email" placeholder="*Email" variant="outlined" margin="normal" value={credentials.email} onChange={handleChange} sx={{ bgcolor: 'white', borderRadius: 1, mb: 2 }} error={!!formError} />
                            <TextField fullWidth name="password" type="password" placeholder="*Password" variant="outlined" margin="normal" value={credentials.password} onChange={handleChange} sx={{ bgcolor: 'white', borderRadius: 1, mb: 2 }} error={!!formError} />
                            {(formError || error) && (
                                <FormHelperText error sx={{ mb: 2 }}>
                                    {formError || error?.response?.data?.message || 'An unexpected error occurred'}
                                </FormHelperText>
                            )}
                            <Button type="submit" fullWidth variant="outlined" disabled={loading} sx={{ py: 1.5, '&:hover': { bgcolor: '#d60b54', color: 'white' } }}>
                                {loading ? <img src="img/spinner.gif" alt="spinnre" width={24} /> : 'Login'}
                            </Button>

                        </form>
                        <p>Don't have an account? <Link to="/register">Sign Up</Link></p>

                    </Paper>
                </Container>
            </Box>
        </Paper>
    );
};

export default LoginTry;
