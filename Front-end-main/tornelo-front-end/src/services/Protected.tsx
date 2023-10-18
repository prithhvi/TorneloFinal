import { Navigate } from "react-router-dom";
import React, { ReactNode } from "react"; // Import ReactNode type for children

interface ProtectedProps {
  isLoggedIn: boolean;
  children: ReactNode; // Use ReactNode type for children
}


const Protected: React.FC<ProtectedProps> = ({ isLoggedIn, children }) => {
  // If the user is not logged in, redirect to "/shop" route
  if (!isLoggedIn) {
    return <Navigate to="/shop" replace />;
  }
  // If the user is logged in, render the protected content
  return <>{children}</>;
};

export default Protected;
