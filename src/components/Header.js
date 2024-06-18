import React from "react";
import { authRepository } from "../repositories/auth";
import { Link } from "react-router-dom";

export const Header = (props) => {
  const signout = async () => {
    await authRepository.signout();
    props.setCurrentUser(null);
  };
  return (
    <header className="bg-[#444] p-4">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          <Link className="flex justify-center leading-1" to="/">
            <span className="i-lucide-home"></span>
          </Link>
        </h1>
        <div className="header-menu flex gap-4">
          <Link className="text-white hover:text-red-600" to="/myposts">
            Myposts
          </Link>
          <button
            className="text-white hover:text-red-600 flex items-center"
            onClick={signout}
          >
            Logout
            <span className="i-lucide-log-out block ml-2"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
