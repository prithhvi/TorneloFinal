// src/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../component-css/LoginPage.css';

/**
 * LoginPage component allows users to sign in by entering their email address and password.
 * Upon successful authentication, users are redirected to different routes based on their roles.
 *
 * @component
 * @example
 * // Example usage of LoginPage component in a Route:
 * <Route path="/login" element={<LoginPage />} />
 */

function LoginPage() {
  // Hook to handle navigation within the application
  const navigate = useNavigate();
  // State variables to manage the username and password input values
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

    /**
   * Event handler for form submission. Validates user credentials with the API
   * and redirects users based on their roles.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - Form submission event
   */
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
        try {
            const response = await fetch(`http://localhost:5100/api/user/search/${username}`);
            if (response.ok) {
                const user = await response.json();
                //setUsername(user.userFirstName);
                setPassword(user.Password);
                console.log(user)
                sessionStorage.setItem("USER_ROLE", user[0].userrole);
                if (user[0].userrole === "ROLE_ADMIN"){
                  navigate('/shop-admin')
                }
                else{
                  navigate('/shop')
                }
            } else {
                console.error('Error retrieving User data');
            }
        } catch (error) {
            console.error(error);
        }
    };

      return (
        <div className="Auth-form-container">
          <form className="Auth-form" onSubmit={handleSubmit}>
            <div className="Auth-form-content">
            <h2 className="ShopPageTitle"> <img src={require('../images/tornelo.png')} alt="Cart" className="img-tornelo" /> Tornelo Shop </h2>
              <h3 className="Auth-form-title">Sign In</h3>
              <div className="form-group mt-3">
                <label className='loginForm'>Email address</label>
                <input
                  className="uname-input"
                  type="text"
                  placeholder="Enter email"
                  value = {username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group mt-3">
                <label className='loginForm'>Password</label>
                <input
                  type="password"
                  className="pwd-input"
                  placeholder="Enter password"
                />
              </div>
              <div className="d-grid gap-2 mt-3">
                <button type="submit" className="btn-login">
                  Submit
                </button >
              </div>

            </div>
          </form>
        </div>
      )
    }

    export default LoginPage;