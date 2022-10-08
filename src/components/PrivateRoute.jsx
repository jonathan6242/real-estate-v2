
import { Outlet, Navigate } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";

function PrivateRoute() {
  const { user, loading } = useAuthUser();

  if(loading) {
    return <></>
  }

  return user ? <Outlet /> : <Navigate to='/signin' />
}

export default PrivateRoute