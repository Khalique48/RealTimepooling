import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { token, logout } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Real-Time Polling
        </Link>
        <nav>
          {token ? (
            <div className="flex items-center space-x-4">
              <Link to="/create-poll" className="btn btn-primary">
                Create Poll
              </Link>
              <button
                onClick={logout}
                className="btn bg-red-500 text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
              <Link
                to="/register"
                className="btn bg-green-500 text-white hover:bg-green-700"
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
