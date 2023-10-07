/* eslint-disable react/prop-types */
import fblogo from "../assets/fblogo.png";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NavBar = (props) => {
  const [user, setUser] = useState({
    avatar: "",
    email: "",
    _id: "",
  });
  const [profiles, setProfiles] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [foundProfiles, setFoundProfiles] = useState([]);
  const [hamburgerMenuOn, setHamburgerMenuOn] = useState(false);
  const [userMenuOn, setUserMenuOn] = useState(false);

  const hamburgerMenuHandler = () => {
    setHamburgerMenuOn((prevState) => !prevState);
  };

  const userMenuHandler = () => {
    setUserMenuOn((prevState) => !prevState);
  };

  const userMenuStyle = {
    display: userMenuOn ? "flex" : "none",
    flexDirection: "column",
  };

  const hamburgerMenuStyle = {
    display: hamburgerMenuOn ? "flex" : "none",
    flexDirection: "column",
  };

  const fetchProfiles = async () => {
    const request = await fetch(`https://patient-bush-3727.fly.dev/api/users`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const response = await request.json();

    if (response.users !== undefined) {
      const allProfiles = [...response.users];
      const index = allProfiles.findIndex(
        (profile) => profile._id.toString() === user._id.toString()
      );
      allProfiles.splice(index, 1);
      setProfiles(allProfiles);
    }
  };

  const searchHandler = (e) => {
    setSearchValue(e.target.value);
  };

  const logout = async () => {
    const request = await fetch("https://patient-bush-3727.fly.dev/api/logout", {
      method: "GET",
      headers: { "Content-type": "application/json" },
    });
    const response = await request.json();
    console.log(response);
    if (response.message !== undefined) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      props.logoutHandler();
    }
  };

  useEffect(() => {
    fetchProfiles();
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, [props.userUpdate]);

  useEffect(() => {
    const filteredValue = profiles.filter((profile) => {
      if (searchValue === "") {
        return "";
      } else {
        return profile.fullName
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      }
    });
    setFoundProfiles(filteredValue);
  }, [searchValue]);

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 new-navbar">
      <div className="flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="navbar-left">
          <Link to="/" style={{ display: "flex", alignItems: "center" }}>
            <img
              src={fblogo}
              alt="Fakebook Logo"
              className="navbar-logo h-8 mr-3"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white logo-text">
              Fakebook
            </span>
          </Link>
          <div className="navbar-search-section">
            <span className="material-symbols-outlined navbar-search-icon">
              search
            </span>
            <input
              type="text"
              placeholder="Search Fakebook"
              className="navbar-search-input"
              name="search"
              value={searchValue}
              onChange={searchHandler}
            />
            <div className="search-bar-results">
              {foundProfiles.map((profile) => (
                <li key={profile._id} className="search-bar-result-item">
                  <Link
                    to={`/user/${profile._id}`}
                    className="friends-tab-friend"
                  >
                    <img
                      src={profile.avatar}
                      alt="friend-avatar"
                      className="navbar-profile-pic"
                    />
                    <div>{profile.fullName}</div>
                  </Link>
                </li>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center navbar-center">
          <Link
            to="/"
            className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
          >
            <span className="material-symbols-outlined navbar-middle-tab">
              home
            </span>
          </Link>
          <Link
            to="/friends"
            className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
          >
            <span className="material-symbols-outlined navbar-middle-tab">
              group
            </span>
          </Link>
        </div>
        <div className="flex items-center md:order-2">
          <button
            type="button"
            className="flex mr-3 text-sm rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 user-btn"
            id="user-menu-button"
            aria-expanded="false"
            data-dropdown-toggle="user-dropdown"
            data-dropdown-placement="bottom"
            onClick={userMenuHandler}
          >
            <span className="sr-only">Open user menu</span>
            <img
              className="w-8 h-8 rounded-full navbar-profile-pic"
              src={user.avatar}
              alt="user photo"
            />
          </button>
          {/*<!-- Dropdown menu -->*/}
          <div
            className="z-50 my-4 text-base list-none user-dropdown bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
            id="user-dropdown"
            style={userMenuStyle}
          >
            <div className="px-4 py-3">
              <span className="block text-sm text-gray-900 dark:text-white">
                <Link to={`/user/${user._id}`}>{user.fullName}</Link>
              </span>
              <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
                {user.email}
              </span>
            </div>
            <ul className="py-2" aria-labelledby="user-menu-button">
              <li>
                <button href="#" className="logout-btn" onClick={logout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
          <button
            data-collapse-toggle="navbar-user"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-user"
            aria-expanded="false"
            onClick={hamburgerMenuHandler}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className="items-center justify-between w-full md:flex md:w-auto md:order-1"
          id="navbar-user"
          style={hamburgerMenuStyle}
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link
                to="/"
                className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
              >
                <span className="material-symbols-outlined navbar-middle-tab">
                  home
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/friends"
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                <span className="material-symbols-outlined navbar-middle-tab">
                  group
                </span>
              </Link>
            </li>

            <div className="relative mt-3 md:hidden">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="search-navbar"
                className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search..."
                value={searchValue}
                onChange={searchHandler}
              />
              <div className="search-bar-results">
                {foundProfiles.map((profile) => (
                  <li key={profile._id} className="search-bar-result-item">
                    <Link
                      to={`/user/${profile._id}`}
                      className="friends-tab-friend"
                    >
                      <img
                        src={profile.avatar}
                        alt="friend-avatar"
                        className="navbar-profile-pic"
                      />
                      <div>{profile.fullName}</div>
                    </Link>
                  </li>
                ))}
              </div>
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
