import { Link } from "react-router-dom";
import { CustomerForm } from "../components";

export const HomePage = () => {
  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <Link to="/support" className="absolute top-10 right-10 bg-slate-700 p-4 rounded-md text-white hover:bg-slate-500 cursor-pointer">Employees</Link>
      <CustomerForm/>
    </div>
  );
};
