import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";

function ProtectedRoute({ component: Component, ...restOfProps }) {
  // const userLogin = useSelector((state) => state.users.login);
  // console.log(userLogin);

  var login = JSON.parse(localStorage.getItem("login"));
  console.log(login);

  return (
    <Route
      {...restOfProps}
      render={(props) =>
        login ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}

export default ProtectedRoute;
