import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    FormHelperText,
    Paper
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../global-states/store';
import { login } from '../global-states/userSlice';
import { useLanguage } from "../../context/LanguageContext";

const LogoRing = styled(Box)(({ theme }) => ({
    width: 250,
    height: 250,
    border: `25px solid ${theme.palette.error.main}`, // No changes needed here
    borderRadius: '50%',
    position: 'relative',
    margin: '0 auto 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const Login = () => {
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();
    const { language } = useLanguage();
    const translations = {
        en: {
            welcome: "Welcome Back!",
            login: "Login to Your Account",
            email: "*Email",
            password: "*Password",
            submit: "Login",
            noAccount: "Don't have an account?",
            signUp: "Sign Up",
        },
        he: {
            welcome: "ברוך שובך!",
            login: "התחבר לחשבונך",
            email: "*אימייל",
            password: "*סיסמה",
            submit: "התחבר",
            noAccount: "אין לך חשבון?",
            signUp: "הרשם",
        },
    };

    const t = translations[language];

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
            sessionStorage.setItem('token', (resultAction.payload as { token: string }).token);
            const payload = resultAction.payload as { token: string; user: { name: string; id: string } };
            sessionStorage.setItem('name', payload.user.name);
            sessionStorage.setItem('id', payload.user.id);

            if (login.fulfilled.match(resultAction)) {
                navigate("/myWorkspace");
            }
        } catch (err) {
            setFormError("Login error, please try again");
            console.log(err);
        }
    };

    return (
        <Paper
            sx={{
                zIndex: -0.5,
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                 top: 50,
                position: 'relative',
                bgcolor: theme.palette.background.default, // Use theme background
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', p: 3 }}>
                <Container maxWidth="sm">
                    <LogoRing sx={{ border: `25px solid ${theme.palette.primary.main}` }}>
                        <Typography
                            variant="h4"
                            component="div"
                            align="center"
                            color="primary"
                            sx={{
                                position: 'absolute',
                                width: '100%',
                                fontWeight: 'bold',
                                textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
                            }}
                        >
                            {t.welcome}
                        </Typography>
                    </LogoRing>
                    <Typography variant="h4" component="h1" mb={4}>
                        {t.login}
                    </Typography>
                </Container>
                <Container maxWidth="sm">
                    <Paper
                        elevation={0}
                        sx={{
                            width: '100%',
                            bgcolor: 'transparent',
                            p: 2,
                        }}
                    >
                        <form onSubmit={handleLogin}>
                            <TextField
                                fullWidth
                                name="email"
                                placeholder={t.email}
                                variant="outlined"
                                margin="normal"
                                value={credentials.email}
                                onChange={handleChange}
                                sx={{
                                    bgcolor: theme.palette.background.paper, // Use theme background
                                    borderRadius: 1,
                                    mb: 2,
                                }}
                                error={!!formError}
                            />
                            <TextField
                                fullWidth
                                name="password"
                                type="password"
                                placeholder={t.password}
                                variant="outlined"
                                margin="normal"
                                value={credentials.password}
                                onChange={handleChange}
                                sx={{
                                    bgcolor: theme.palette.background.paper, // Use theme background
                                    borderRadius: 1,
                                    mb: 2,
                                }}
                                error={!!formError}
                            />
                            {(formError || error) && (
                                <FormHelperText error sx={{ mb: 2 }}>
                                    {formError || error/*?.response?.data?.message*/ || 'An unexpected error occurred'}
                                </FormHelperText>
                            )}
                            <Button type="submit" fullWidth variant="outlined" disabled={loading} sx={{ py: 1.5, '&:hover': { bgcolor: '#666699', color: 'white' } }}>
                                {loading ? <img src="img/spinner.gif" alt="spinnre" width={24} /> : t.submit}
                            </Button>

                        </form>
                        <p>{t.noAccount} <Link to="/register">{t.signUp}</Link></p>

                    </Paper>
                </Container>
            </Box>
        </Paper>
    );
};

export default Login;
