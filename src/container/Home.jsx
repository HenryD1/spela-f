import React, { useState, useRef, useEffect } from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Route, Routes } from 'react-router-dom';

import { Sidebar, UserProfile } from '../components';
import { client } from '../client';
import Pins from './Pins';
import logo from '../assets/volley-logo-white.png';

import { userQuery } from '../utils/data';

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  // ^^ this is destructuring in javascript. this gives us a function
  // called setToggleSideBar that lets us set a value, and a function called
  // toggleSidebar that lets us read the state of the sidebar
  const [user, setUser] = useState(null)
  // it sets the "user" state of the home component to "" at first
  
  const scrollRef = useRef(null);

  const userInfo = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear()

  useEffect(() => {
    // this gets the googleId of the user (ifit exists)
    const query = userQuery(userInfo?.googleId);

    client.fetch(query)
      .then((data) => {
        setUser(data[0]);
      })

  }, []);

  useEffect(() => {
    // whenever we re-render this component, scroll it to the top
    scrollRef.current.scrollTo(0,0)
  }, [])

  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out">
      <div className="hidden md:flex h-screen flex-initial"> 
        <Sidebar user={user && user}/>
      </div>
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu fontSize={40} className="cursor-pointer" onClick={() => setToggleSidebar(true)}/>
          <Link to="/">
            <img src={logo} alt="logo" className="w-28"/>
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.image} alt="profilepic" className="w-28" />
          </Link>
        </div>
        {toggleSidebar && (
        <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
          <div className="absolute w-full flex justify-end items-center p-2">
            <AiFillCloseCircle fontSize={30} className="cursor-pointer" onClick={() => setToggleSidebar(false)}/>
          </div>
          <Sidebar user={user && user} closeToggle={setToggleSidebar} /> 
        </div>
      )} 
      </div>
      
      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef} />
      {/* 
        ref={scrollRef} attaches the scrollRef created with useRef to this div element.
        This allows us to programmatically control the scroll behavior of this div,
        such as scrolling to the top when the component updates, as seen in the useEffect hook above.
      */}
      <Routes>
        <Route path="/user-profile/:userId" element={<UserProfile />} />
        <Route path= "/*" element={<Pins user={user && user} />} />
      </Routes>
      

    </div>
  )
}

export default Home
