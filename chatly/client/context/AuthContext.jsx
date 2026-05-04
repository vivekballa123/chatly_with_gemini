// import {  createContext, useEffect, useState } from "react";
// import axios from "axios"
// import toast from "react-hot-toast"
// import {io} from "socket.io-client"
// import { data } from "react-router-dom";

// const backendUrl = import.meta.env.VITE_BACKEND_URL;
// axios.defaults.baseURL = backendUrl;

// export const AuthContext = createContext();

// export const AuthProvider = ({children})=>{
//     const [token,setToken] = useState(localStorage.getItem("token"))
//     const [authUser, setAuthUser] = useState(null)
//     const [onlineUsers, setOnlineUsers] = useState([])
//     const [socket, setSocket] = useState(null)
    
//     //check if the user is authenticated, if yes, set the user data and connected the socket
//     const checkAuth = async () => {
//         try {
//             const {data} = await axios.get("/api/auth/check")
//             if (data.success){
//                 setAuthUser(data.user)
//                 connectSocket(data.user)
//             }
//         } catch (error) {
//            toast.error(error.message) 
//         }
//     }

//     //Login function to handle user authentication and socket connection
//     const login = async (state,credentials) => {
//         try {
//             const {data} =await axios.post(`/api/auth/${state}`,credentials);
//             if (data.success){
//                 setAuthUser(data.userData);
//                 connectSocket(data.userData);
//                 axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
//                 setToken(data.token);
//                 localStorage.setItem("token",data.token)
//                 toast.success(data.message)
//             }else{
//                 toast.error(data.message)
//             }
//         } catch (error) {
//             toast.error(error.message)
//         }
//     }

//     //Logout function to handle logout and socket disconnection
//     const logout = async () => {
//         localStorage.removeItem("token")
//         setToken(null);
//         setAuthUser(null);
//         setOnlineUsers([])
//         axios.defaults.headers.common["token"] =null;
//         toast.success("Logged out successfully")
//         socket.disconnect();
//     }

//     // Update profile function to handle user prifile updates
//     const updateProfile = async (body) => {
//         try {
//             const {data} = await axios.put(
//                 "/api/auth/update-profile",
//                 body,
//             {
//                 headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}
//             });
             
//             if(data.success){
//                 setAuthUser(data.user);
//                 toast.success("profile update successfully")
//                 return data
                
//             }
//             return data
//         } catch (error) {
//             toast.error(error.message)
//         }
//     }


//     //Connect socket function to handle socket connection and online users update
//     const connectSocket = (userData) =>{
//         if(!userData || socket?.connected) return;
//         const newSocket = io(backendUrl,{
//             query:{
//                 userId:userData._id
//             }
//         })
//         newSocket.connect()
//         setSocket(newSocket)

//         newSocket.on("getOnlineUsers",(userIds)=>{
//             setOnlineUsers(userIds)
//         })
//     }
//     useEffect(()=>{
//         if(token){
//             axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
//         }
//         checkAuth()
//     },[token])

//     const value = {
//         axios,
//         authUser,
//         onlineUsers,
//         socket,
//         login,
//         logout,
//         updateProfile

//     }
//     return(
//         <AuthContext.Provider value={value}>
//             {children}
//         </AuthContext.Provider>
//     )
// }

import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    
    useEffect(() => {
        if (token) {
            // set header
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            // run auth check
            checkAuth();
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }
    }, [token]);

    // Check if user is authenticated
    const checkAuth = async () => {
        try {
            const { data } = await axios.get("/api/auth/check");

            if (data.success) {
                setAuthUser(data.user);
                connectSocket(data.user);
            }
        } catch (error) {
            // invalid token → clear state
            localStorage.removeItem("token");
            setToken(null);
            setAuthUser(null);
        }
    };

    //Login / Signup
    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials);

            if (data.success) {
                setAuthUser(data.userData);
                setToken(data.token);
                localStorage.setItem("token", data.token);

                connectSocket(data.userData);

                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);

        socket?.disconnect();

        toast.success("Logged out successfully");
    };

    // Update Profile
    const updateProfile = async (body) => {
        try {
            const { data } = await axios.put("/api/auth/update-profile", body);

            if (data.success) {
                setAuthUser(data.user);
                toast.success("Profile updated successfully");
            }

            return data;
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Socket connection
    const connectSocket = (userData) => {
        if (!userData || socket?.connected) return;

        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id,
            },
        });

        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        });
    };

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};