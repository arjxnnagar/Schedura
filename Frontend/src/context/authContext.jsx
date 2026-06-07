import React, { useContext, useEffect, useState } from 'react'
import { createContext } from 'react'
import api from "../api/axios"

const authContext = createContext();

export const useAuth = ()=>{
  return useContext(authContext);
}
const AuthProvider = ({children}) => {

  const [user,setUser] = useState(null);
  const [token,setToken] = useState(null);
  const [isLoading,setIsLoading] = useState(true);

  useEffect(()=>{

    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if(storedUser && storedToken){
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
    setIsLoading(false);
  },[]);

  const login = (userData,newToken)=>{
    setUser(userData);
    setToken(newToken);
    localStorage.setItem("user",JSON.stringify(userData));
    localStorage.setItem("token", newToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
  }

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  };
  return (
        <authContext.Provider value={{user,token,isLoading,login,logout , isAuthenticated: !!user}}>
            {children}
        </authContext.Provider>
  )
}

export default AuthProvider