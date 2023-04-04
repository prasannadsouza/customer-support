import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { LoginContext } from "../model/user";

export const AuthContainer = ({ children }: { children: React.ReactNode }) => {
  const user = useContext(LoginContext);

  if (!user.token) {
    return <Navigate to="/login" replace={true} />
  }

  return <>{children}</>;
};
