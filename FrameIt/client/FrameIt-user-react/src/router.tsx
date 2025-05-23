/* eslint-disable @typescript-eslint/no-unused-vars */
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./appLayout";
import HomePage from "./component/homePage/homePage";
import Gallery from "./page/gallery/gallery";
import Upload from "./page/upload/upload";
import Collections from "./page/collections";
import Settings from "./component/account/setting";
import Register from "./component/auth/register";
import MyWorkspace from "./page/myWorkspace";
import Login from "./component/auth/login";
import CollageEditor from "./page/collageEditor/collage-editor";
import AIFeaturesDashboard from "./page/AI/AIFeaturesDashboard";
import SmartFiltering from "./page/AI/SmartFiltering";
import ImageAnalysis from "./page/AI/ImageAnalysis";
import FreeSearch from "./page/AI/FreeSearch";
import ImageToArt from "./page/AI/ImageToArt";

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
               index: true,
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
                element: <AIFeaturesDashboard/>,
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
                element: <CollageEditor />,
            },
            {
                path: '/myWorkspace/more',
                element: <AIFeaturesDashboard />,
            },
            {
                path: '/myWorkspace/aiFeatures',
                element: <AIFeaturesDashboard />,
            },
            {
                path: "/myWorkspace/aiFeatures/smartFiltering",
                element: <SmartFiltering />
            },
            {
                path: '/myWorkspace/aiFeatures/imageAnalysis',
                element: <ImageAnalysis />,
            },
            {
                path: '/myWorkspace/aiFeatures/freeSearch',
                element: <FreeSearch />,
            },
            {
                path: '/myWorkspace/aiFeatures/imageToArt',
                element: <ImageToArt />,
            },

        ]
    }
]);