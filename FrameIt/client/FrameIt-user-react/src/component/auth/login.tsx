/* eslint-disable react-refresh/only-export-components */
import React, { useState } from 'react';
import { TextField, Button, Container, Box, Modal, Typography } from '@mui/material';
import { styleModal } from '../../styles';
import { User } from '../../types';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../global-states/store';
import addUser from '../global-states/userSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default () => {
    const [openModal, setOpenModal] = useState(true);
    const [status, setStatus] = useState('login');
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: ''
    });
    
    const userDispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const navToMain = () => {
        navigate('/myWorkspace');
    };

    const changeToSignUp = () => {
        setStatus('register');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('User signed in');
    
        const newUser: User = {
            name: status === 'login' ? '' : userData.name,
            password: userData.password,
            email: userData.email,
            roleName: 'Editor'
        };
    
        try {
            
            const res = await axios.post(`http://localhost:5282/auth/${status}`, newUser);
            console.log(res);
    
            const resultAction = await userDispatch(addUser(newUser));
    
            if (addUser.fulfilled.match(resultAction)) {
                console.log('User added:', resultAction.payload);
                setOpenModal(false); // Close modal after success
                navToMain(); // Navigate to workspace after successful registration
            } else {
                setErrorMessage('Failed to add user: ' + resultAction.error.message);
            }
        } catch (error) {
            console.log(error);
            setErrorMessage('An error occurred while processing your request.');
        }
    };
    

    return (
        <Container>
            <Modal open={openModal} >
                <Box sx={styleModal}>
                    <form onSubmit={handleSubmit}>
                        <Typography variant="h5" sx={{ margin: '20px', fontWeight: 'bold', textAlign: 'center' }}>
                            {status === 'login' ? "Sign In" : "Sign Up"}
                        </Typography>
                        {status === 'register' && 
                            <TextField
                                label='Name'
                                variant="filled"
                                margin="normal"
                                type="text"
                                fullWidth
                                name="name"
                                value={userData.name}
                                onChange={handleChange}
                                required
                            />
                        }
                        <TextField
                            label='Email'
                            variant="filled"
                            margin="normal"
                            type="email"
                            fullWidth
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label='Password'
                            variant="filled"
                            margin="normal"
                            type='password'
                            fullWidth
                            name="password"
                            value={userData.password}
                            onChange={handleChange}
                            required
                        />
                        {errorMessage && <Typography color="error" sx={{ marginTop: '10px' }}>{errorMessage}</Typography>}
                        <Button sx={{ marginTop: '2px' }} fullWidth variant="text" color='primary' type="submit">
                            {status === 'login' ? 'Login' : 'Register'}
                        </Button>
                    </form>

                    <p>Don't have an account? <a onClick={changeToSignUp}>Sign Up</a></p>
                </Box>
            </Modal>
        </Container>
    );
};
