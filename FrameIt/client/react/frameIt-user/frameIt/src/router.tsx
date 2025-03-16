import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./appLayout";
import HomePage from "./component/homePage";
import SignIn from "./component/auth/SignIn";
import Gallery from "./page/gallery";

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
                path: '/login',
                element: <SignIn />,
            },
            {
                path: '/gallery',
                element: <Gallery />,
            },
        ]
    }
]);