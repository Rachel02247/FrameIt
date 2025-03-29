import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./appLayout";
import HomePage from "./component/homePage/homePage";
import Gallery from "./page/gallery/gallery";
import Upload from "./page/upload/upload";
import Collections from "./page/collections";
import Design from "./page/design/design";
import More from "./page/more";
import Settings from "./component/account/setting";
import Sidebar from "./component/sideBar";
import Register from "./component/auth/register";
import MyWorkspace from "./page/myWorkspace";
import LoginTry from "./component/auth/loginTry";

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
                element: <LoginTry />,
            }, 
             {
                path: '/register',
                element: <Register />,
            }, 
            {
                path: '/settings',
                element: <Settings />,
            },
            {
                path: '/gallery',
                element: <Gallery />,
            },
            {
                path: '/upload',
                element: <Upload />,
            },
            {
                path: '/collections',
                element: <Collections />,
            },
            {
                path: '/design',
                element: <Design />,
            },
            {
                path: '/more',
                element: <More />,
            },
            {
                path: '/myWorkspace',
                element: <MyWorkspace/>,
                children:[
                    {
                        path: '/myWorkspace/gallery',
                        element: <Gallery />,
                    },
                    {
                        path: '/myWorkspace/upload',
                        element: <Upload />,
                    },
                    {
                        path: '/myWorkspace/collections',
                        element: <Collections />,
                    },
                    {
                        path: '/myWorkspace/design',
                        element: <Design />,
                    },
                    {
                        path: '/myWorkspace/more',
                        element: <More />,
                    },
                ]
            }
          
        ]
    }
]);