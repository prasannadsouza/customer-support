import { Outlet } from "react-router-dom";
import { Header } from "../components";

export const HomeLayout = () => {
  return (
    <div className="flex flex-1 flex-col">
      <Header/>
      <Outlet/>
    </div>
  )
};
