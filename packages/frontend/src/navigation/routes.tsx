import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import { LoginPage, HomeLayout, AllTickets, HomePage } from "../container";

const router = createBrowserRouter([
    {
        path: "/",
      element: <HomePage/>,
    },
    {
        path: "/support",
        element: <HomeLayout />,
        children: [
            {
                path: "",
                element: <AllTickets />,
            },
            {
                path: ":id",
                element: <div>single ticket</div>,
            },
        ]
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/admin",
        element: <div>Team</div>,
    }
]);

export const Navigation = () => {
    return <RouterProvider router={router} />;
};
