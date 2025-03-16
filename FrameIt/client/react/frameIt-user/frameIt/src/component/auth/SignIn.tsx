import React, { useState } from 'react';
import { TextField, Button, Container, Box, Modal, Typography } from '@mui/material';
import { styleModal } from '../../styles';
import {  useDispatch } from 'react-redux';
import {  AppDispatch } from '../global-states/store';
import { addUser } from '../global-states/userSlice';
import axios from 'axios';


const SignIn = () => {
    const [openModal, setOpenModal] = useState(true);
    const [status, setStatus] = useState('login');

    const nameRef = React.useRef<HTMLInputElement>(null);
    const emailRef = React.useRef<HTMLInputElement>(null);
    const passwordRef = React.useRef<HTMLInputElement>(null);

    // const user = useSelector((state: RootState) => state.user);
    const userDispatch = useDispatch<AppDispatch>();


    const changeToSignUp = () => {
        setStatus("register");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('User signed in');

       
        const newUser = {
            name: status === 'login' ? '' : nameRef.current?.value,
            email: emailRef.current?.value,
            password: passwordRef.current?.value,
        };

        try {
            const res = await axios.post("http://localhost:5282/users", newUser);
console.log(res)
            // // Dispatch the addUser action
            // const resultAction = await userDispatch(addUser(newUser));

            // if (addUser.fulfilled.match(resultAction)) {
            //     console.log('User added:', resultAction.payload);
            //     setOpenModal(!openModal);
            // } else {
            //     console.error('Failed to add user:', resultAction.error.message);
            // }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Container>
            <Modal open={openModal} >
                <Box sx={styleModal}>
                    <form onSubmit={handleSubmit}>
                        <Typography variant="h5" sx={{ margin: '20px', fontWeight: 'bold', textAlign: 'center' }}>{status === 'login' ? "sign in" : "sign up"}</Typography>
                        {status === 'register' && <TextField label='name' variant="filled" margin="normal" type="text" fullWidth inputRef={nameRef} required />}
                        <TextField label='email' variant="filled" margin="normal" type="email" fullWidth inputRef={emailRef} required />
                        <TextField label='password' variant="filled" margin="normal" type='password' fullWidth inputRef={passwordRef} required />
                        <Button sx={{ marginTop: '2px' }} fullWidth variant="text" type="submit">{status == 'login' ? 'login' : 'register'}</Button>
                    </form>

                    <p>don't have an account? <a onClick={changeToSignUp}>sign up</a></p>

                </Box>
            </Modal>
        </Container>
    );
};


export default SignIn;
