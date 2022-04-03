import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../lib/auth";

const Header = () => {
  const { logOut, user } = useAuth();

  return (
    <div className='py-3 border-bottom bg-light '>
      <div className='container d-flex justify-content-between align-items-center'>
        <Link className='h5 text-dark text-decoration-none' to='/'>
          Book<strong className='text-primary'>Shelf</strong>
        </Link>
        {user && (
          <div className='d-flex align-items-center'>
            <span>{user.name}</span>
            <button
              onClick={logOut}
              className='btn btn-sm ms-2 btn-outline-danger'
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
