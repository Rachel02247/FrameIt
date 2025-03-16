import React, { useState } from 'react';
import { TextField, Button, Container } from '@mui/material';

const SignUp: React.FC = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('User signed up:', user);
        
    };

    return (
        <Container>
            <form onSubmit={handleSubmit}>
                <h2>Sign Up</h2>
                <TextField
                    label="Name"
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={user.email}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={user.password}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <Button type="submit" variant="contained" color="primary">
                    Sign Up
                </Button>
            </form>
        </Container>
    );
};

export default SignUp;
