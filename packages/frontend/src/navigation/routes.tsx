import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { LoginPage } from "../container";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
  {
    path: "/login",
    element: <LoginPage/>
  }
]);

export const Navigation = () => {
  return <RouterProvider router={router} />;
};
