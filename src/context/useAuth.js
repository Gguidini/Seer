import React, { useState, useContext, createContext } from "react";
import { firebaseDemoConfig, initializeFirebaseConnection } from '../services/firebase.js';

const authContext = createContext();

export function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
  }

  export const useAuth = () => {
    return useContext(authContext);
  };

  function useProvideAuth() {
    const [user, setUser] = useState(undefined);
    // Wrap any Firebase methods we want to use making sure ...
    // ... to save the user to state.
    const signin = (configToUse) => {
      setUser(configToUse || firebaseDemoConfig)
      initializeFirebaseConnection(configToUse || firebaseDemoConfig)

      return true
    };

    const signout = () => {
        setUser(undefined);
        return true
    };

    // TODO: Save config in localStorage and fetch
    // useEffect(() => {
      
    // }, []);
    // Return the user object and auth methods
    return {
      user,
      signin,
      signout
    };
  }