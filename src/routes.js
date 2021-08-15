import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { useAuth, ProvideAuth } from './context/useAuth';
import Home from './pages/Home';
import Connect from './pages/Connect';

function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

function Routes() {
  return (
    <ProvideAuth>
      <BrowserRouter>
        <Switch>
          <Route path='/login' component={Connect} />
          <PrivateRoute path='/'>
            <Home />
          </PrivateRoute>
        </Switch>
      </BrowserRouter>
    </ProvideAuth>
  )
}

export default Routes;