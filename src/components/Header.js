import React, { useState } from "react";
import { authRepository } from "../repositories/auth";
import { Link } from "react-router-dom";
import { postRepository } from "../repositories/post";

export const Header = (props) => {
  const [keyword, setKeyword] = useState("");

  const signout = async () => {
    await authRepository.signout();
    props.setCurrentUser(null);
  };

  const handleSearch = async () => {
    const textSearch = await postRepository.searchposts(keyword);
    props.setPosts(textSearch);
    console.log(textSearch);
  };
  return (
    <header className="bg-[#444] p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-white mr-4">
            <Link className="flex justify-center leading-1" to="/">
              <span className="i-lucide-home"></span>
            </Link>
          </h1>

          <div className="max-w-md mx-auto">
            <label
              for="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div className="relative w-96">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <span className="i-lucide-search" />
              </div>
              <input
                type="search"
                id="default-search"
                value={keyword}
                className="block w-full p-2 ps-10 text-10 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search..."
                onChange={(e) => setKeyword(e.target.value)}
                required
              />
              <button
                onClick={handleSearch}
                type="submit"
                className="text-white absolute end-1.5 bottom-1.5 bg-green-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-10 px-2 py-1 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Search
              </button>
            </div>
          </div>
        </div>
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
