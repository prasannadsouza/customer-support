import { useContext } from "react";
import { Link } from "react-router-dom";
import { LoginContext } from "../model/user";

export const Header = () => {
  const user = useContext(LoginContext);

  const logout = () => {
    user.setCurrentToken(null);
  };

  return (
    <nav className="bg-gray-900 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <Link to="/" className="text-gray-300 hover:text-white">
            Home
          </Link>
          <Link to="/support" className="text-gray-300 hover:text-white">
            Tickets
          </Link>
          <Link to="/teams" className="text-gray-300 hover:text-white">
            Team
          </Link>
        </div>
        <button
          onClick={logout}
          className="text-gray-300 font-semibold hover:text-white px-3 py-2 rounded-md border border-gray-300"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
