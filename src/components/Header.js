import React from "react";
import { authRepository } from "../repositories/auth";
import { Link, useNavigate } from "react-router-dom";

export const Header = (props) => {
  const navigate = useNavigate();

  const signout = async () => {
    await authRepository.signout();
    props.setCurrentUser(null);
  };
  return (
    <header className="bg-[#444] p-4">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">
          <Link to="/">Home</Link>
        </h1>

        <Link className="text-white hover:text-red-600" to="/myposts">
          Myposts
        </Link>
        <button className="text-white hover:text-red-600" onClick={signout}>
          Logout
        </button>
      </div>
    </header>
  );
};
