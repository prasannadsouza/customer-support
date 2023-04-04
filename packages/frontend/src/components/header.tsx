import { Link } from "react-router-dom";

export const Header = () => {
    const logout = () => {};

    return (
        <nav className="flex items-center justify-between flex-wrap p-6">
            <div className="w-full flex-grow flex items-center">
                <div className="text-sm flex-grow flex gap-4">
                    <Link to="/" className="block m-4 text-white-200">
                        Home
                    </Link>
                    <Link to="/support" className="block m-4 text-white-200">
                        All Tickets
                    </Link>
                    <Link to="/team" className="block m-4 text-white-200">
                        Team
                    </Link>
                    <a onClick={logout} className="cursor-pointer block m-4 text-white-200">
                        Logout
                    </a>
                </div>
            </div>
        </nav>
    );
}
