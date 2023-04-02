import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { AllTickets, AuthContainer, HomeLayout, HomePage, LoginPage, SingleTicket, TeamPage } from "../container";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/support",
    element: <AuthContainer><HomeLayout /></AuthContainer>,
    children: [
      {
        path: "",
        element: <AllTickets />,
      },
      {
        path: ":id",
        element: <div><SingleTicket /></div>,
      },
    ]
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/teams",
    element: <AuthContainer><HomeLayout /></AuthContainer>,
    children: [
      {
        path: "",
        element: <TeamPage />,
      },
    ]
  }
]);

export const Navigation = () => {
  return <RouterProvider router={router} />;
};
