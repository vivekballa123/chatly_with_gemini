import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [currState,setCurrState] = useState("Sign up")
  const [fullName,setFullName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [bio,setBio] = useState("")
  const [isDataSubmited,setIsDataSubmited] = useState(false)
  const navigate = useNavigate();
  const {login} = useContext(AuthContext)


  const onSubmitHandler=async(event)=>{
      event.preventDefault();
      if(currState === "Sign up" && !isDataSubmited){
        setIsDataSubmited(true)
        return;
      }
      // login(currState === "Sign up" ? 'signup' : 'login',{fullName,email,password,bio})
      if (currState === "Login") {
        await login("login", { email, password });   // ✅ only required fields
      } else {
        await login("signup", { fullName, email, password, bio }); // ✅ full data
      } 
  }

  return (
    
    <div className='min-h-screen bg-cover flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      {/* -------left--------- */}
      <img src={assets.logo_icon} alt="" className='w-[min(30vw,250px)]' />
      {/* -------right--------- */}
      <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg' action="">
       <h2 className='font-medium test-2xl flex justify-between items-center'>
        {currState}
        {isDataSubmited && <img onClick={()=>setIsDataSubmited(false)} src={assets.arrow_icon} className='w-5 cursor-pointer' alt="" />}
        
       </h2>
       {currState ==="Sign up" && !isDataSubmited &&(
        <input onChange={(e)=>setFullName(e.target.value)} type="text" value={fullName} className='p-2 border border-gray-500 rounded-md focus:outline-none' placeholder='Full Name' required  id=""/>
       )}
       {!isDataSubmited && (
        <>
            <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white' required placeholder='EmailAddress' name="" id="" />
            <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' required placeholder='Password' name="" id="" />
        </>
       )}
       {
        currState === "Sign up" && isDataSubmited && (
          <textarea onChange={(e)=>setBio(e.target.value)} value={bio}  rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='provide a short bio...'></textarea>
        )
       }
       <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 rounded-md cursor-pointer' >
        {currState === "Sign up" ?"Create Account":"Login Now"}
       </button>
       <div className='flex items-center gap-2 text-sm text-gray-500  '>
          <input type="checkbox" className='cursor-pointer'/>
          <p>Agree to the terms of use & privacy policy.</p>
       </div>
       <div className='flex flex-col gap-2'>
          {currState ==="Sign up"?(
            <p className='text-sm text-gray-600 '>Alredy have an account? <span
            onClick={()=>setCurrState("Login")} className='font-medium text-violet-500 cursor-pointer'>Login here</span></p>
          ):(
            <p className='text-gray-600'>Create an account <span
            onClick={()=>setCurrState("Sign up")}className='font-medium text-violet-500 cursor-pointer'>Click here</span></p>
          )}
       </div>
      </form>
    </div>
  )
}

export default LoginPage
