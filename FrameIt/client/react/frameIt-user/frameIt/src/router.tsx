import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./appLayout";
import HomePage from "./component/homePage";
import SignUp from "./component/auth/SignUp";
import SignIn from "./component/auth/SignIn";

export const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <>
                <AppLayout />
            </>
        ),
        children: [
            {
                path: '/home',
                element: <HomePage />,
            },
            {
                path: '/register',
                element: <SignUp />,
            },
            {
                path: '/login',
                element: <SignIn />,
            },

        ]
    }
]);