// withAuth.tsx
import React from "react";
import { Navigate } from "react-router-dom";

const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  return (props: any) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
