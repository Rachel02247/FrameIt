/* eslint-disable @typescript-eslint/no-unused-vars */
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./appLayout";
import HomePage from "./component/homePage/homePage";
import Gallery from "./page/gallery/gallery";
import Upload from "./page/upload/upload";
import Collections from "./page/collections";
import Design from "./page/design/design";
import Settings from "./component/account/setting";
// import Sidebar from "./component/sideBar";
import Register from "./component/auth/register";
import MyWorkspace from "./page/myWorkspace";
import Login from "./component/auth/login";
import CollageEditor from "./page/collageEditor/collage-editor";
import AIFeaturesDashboard from "./AI/pages/AIFeaturesDashboard";
import SmartFiltering from "./AI/pages/SmartFiltering";
import ImageAnalysis from "./AI/pages/ImageAnalysis";
import FreeSearch from "./AI/pages/FreeSearch";
import ImageToArt from "./AI/pages/ImageToArt";

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
                element: <CollageEditor />,
            },
            {
                path: '/more',
                element: <Design />,
            },
            {
                path: '/ai-features',
                element: <AIFeaturesDashboard />,
            },
            {
                path: "/ai-features/smart-filtering",
                element: <SmartFiltering />
            },
            {
                path: '/ai-features/image-analysis',
                element: <ImageAnalysis />,
            },
            {
                path: '/ai-features/free-search',
                element: <FreeSearch />,
            },
            {
                path: '/ai-features/image-to-art',
                element: <ImageToArt />,
            },
            {
                path: '/myWorkspace',
                element: <MyWorkspace />,
            },
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
                element: <CollageEditor />,
            }

        ]
    }
]);