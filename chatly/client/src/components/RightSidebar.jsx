import React, { useContext, useEffect, useState } from 'react'
import assets, { imagesDummyData } from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'

const RightSidebar = () => {
  const {selectedUser,messages} = useContext(ChatContext)
  const {logout,onlineUsers} = useContext(AuthContext)
  const[msgImages,setMagImages] = useState([])

  useEffect(()=>{
    setMagImages(
      messages.filter(msg =>msg.image).map(msg=>msg.image)
    )
  })

  return selectedUser && (
    <div className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll ${selectedUser?"max-md:hidden":"" }`}>
      
      <div className='pt-16 flex flex-col gap-2 text-xs font-light mx-auto items-center'>
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-20 aspect-[1/1] rounded-full' />
        <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2' >{selectedUser.fullName}
            {onlineUsers.includes(selectedUser._id) && <p className='w-2 h-2 rounded-full bg-green-500'></p>}
        </h1>
        <p className='pl-4'>{selectedUser.bio}</p>
      </div>
      <hr className='border-[#ffffff50]' />
      <div className='px-5 text-xs'>
        <p>Media</p>
        <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
            {msgImages.map((url,index)=>(
                <div key={index} onClick={()=>window.open(url)} className='corsor-pointer '>
                        <img src={url} alt="" className=' h-full rounded-md cursor-pointer' />
                </div>
            ))}
        </div>
      </div>
      <button onClick={()=>logout()} className='absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm rounded-full font-light py-2 px-20  cursor-pointer '>
        Logout
      </button>
    </div>
  )
}

export default RightSidebar
