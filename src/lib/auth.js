import React, { useState, useEffect, useContext, createContext } from "react";
import { Route } from "react-router";
import Login from "../pages/Login";
import { getAuth, GoogleAuthProvider, signOut, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import Preloader from '../components/Preloader'
import firebaseConfig from './firebase';
import { initializeApp } from "firebase/app";

const initializeFirebase = () => {
  initializeApp(firebaseConfig);
}
initializeFirebase();
const authContext = createContext();

export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

export const PrivateRoute = ({
  component: Component,
  handleChildFunc,
  ...rest
}) => {
  const { user, loginStatus } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) =>
        loginStatus.status === "pending" ? (
          <Preloader />
        ) : user ? (
          <Component {...props} />
        ) : (
          <Login />
        )
      }
    />
  );
};

function useProvideAuth() {
  const [user, setUser] = useState();
  const [loginStatus, setLoginStatus] = useState({
    status: "idle",
    error: null,
  });

  const formatUser = (user) => ({
    email: user.email,
    name: user.displayName,
    provider: user.providerData[0].providerId,
    photoUrl: user.photoURL,
    uid: user.uid,
  });


  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((response) => {
        const formattedUser = formatUser(response.user);
        setUser(formattedUser);
        setLoginStatus({ status: "resolved", error: null });
        return formattedUser;
      })
      .catch((err) => {
        setUser(null);
        setLoginStatus({ status: "resolved", error: err.message });
      })
  }

  const logOut = () => {
    signOut(auth).then(() => {
      setUser(null);
      setLoginStatus({ status: "idle", error: null });
    }).catch((error) => {
      console.log(error.message);
    })
  };

  useEffect(() => {
    setLoginStatus({ status: "pending", error: null });
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const formattedUser = formatUser(user);
        setUser(formattedUser);
        setLoginStatus({ status: "resolved", error: null });
      } else {
        setUser(false);
        setLoginStatus({ status: "idle", error: null });
      }
    })
    return () => unsubscribe;
  }, [auth]);

  return {
    user,
    loginStatus,
    signInWithGoogle,
    logOut,
  };
}
