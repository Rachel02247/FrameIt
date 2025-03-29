
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
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../global-states/store';
import { register } from '../global-states/userSlice';


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

const Register = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();

    const [newUser, setNewUser] = useState({
        Name: '',
        Email: '',
        Password: '',
        RoleName: 'Editor'
    });

    const [formError, setFormError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewUser({
            ...newUser,
            [e.target.name]: e.target.value
        });
        setFormError(null);
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!newUser.Name || !newUser.Email || !newUser.Password) {
            setFormError("you have to fill all the fields");
            return;
        }

        try {
            const resultAction = await dispatch(register(newUser));
            if (register.fulfilled.match(resultAction)) {
                navigate("/myWorkspace");
            }
        } catch (err) {
            setFormError("register error, please try again");
            console.log(err);
        }
    };

    return (
        <Paper sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgb(255, 255, 255)' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', p: 3 }}>
                <Container maxWidth="sm">
                    <LogoRing sx={{ border: '25px solid #e60060'! }}>
                        <Typography variant="h4" component="div" align="center" color='primary' sx={{ position: 'absolute', width: '100%', fontWeight: 'bold', textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
                            welcome <br />Geust
                        </Typography>
                    </LogoRing>
                    <Typography variant="h4" component="h1" mb={4}>
                        ready to join us?
                    </Typography>
                </Container>
                <Container maxWidth="sm">

                    <Paper elevation={0} sx={{ width: '100%', bgcolor: 'transparent', p: 2 }}>
                        <form onSubmit={handleRegister}>
                            <TextField fullWidth name="Name" placeholder="*name" variant="outlined" margin="normal" value={newUser.Name} onChange={handleChange} sx={{ bgcolor: 'white', borderRadius: 1, mb: 2 }} error={!!formError} />
                            <TextField fullWidth name="Email" placeholder="*email" variant="outlined" margin="normal" value={newUser.Email} onChange={handleChange} sx={{ bgcolor: 'white', borderRadius: 1, mb: 2 }} error={!!formError} />
                            <TextField fullWidth name="Password" type="password" placeholder="*password" variant="outlined" margin="normal" value={newUser.Password} onChange={handleChange} sx={{ bgcolor: 'white', borderRadius: 1, mb: 2 }} error={!!formError} />
                            {(formError || error) && (
                               <FormHelperText error sx={{ mb: 2 }}>
                               {formError || error?.response?.data?.message || 'An unexpected error occurred'}
                           </FormHelperText>
                           
                            )}
                            <Button type="submit" fullWidth variant="outlined" disabled={loading} sx={{ py: 1.5, '&:hover': { bgcolor: '#d60b54', color: 'white' } }}>
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'register'}
                            </Button>
                        </form>
                    </Paper>
                </Container>
            </Box>
        </Paper>
    );
};

export default Register;
