import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./appLayout";
import HomePage from "./component/homePage/homePage";
import SignIn from "./component/auth/login";
import Gallery from "./page/gallery/gallery";
import Upload from "./page/upload/upload";
import Collections from "./page/collections";
import Design from "./page/design";
import More from "./page/more";
import ToolBar from "./component/toolBar";
import Settings from "./component/account/setting";
import Sidebar from "./component/sideBar";
import Login from "./component/auth/login";

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
                element: <Login />,
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
                element: <Sidebar/>,
                children:[
                    {
                        path: 'myWorkspace/gallery',
                        element: <Gallery />,
                    },
                    {
                        path: 'myWorkspace/upload',
                        element: <Upload />,
                    },
                    {
                        path: 'myWorkspace/colletions',
                        element: <Collections />,
                    },
                    {
                        path: 'myWorkspace/design',
                        element: <Design />,
                    },
                    {
                        path: 'myWorkspace/more',
                        element: <More />,
                    },
                ]
            }
          
        ]
    }
]);