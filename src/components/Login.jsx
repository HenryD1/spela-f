
// Just importing stuff
import React, { useEffect } from 'react'
import { FcGoogle } from 'react-icons/fc';
import violinVideo from '../assets/violin.mp4';
import logo from '../assets/volley-logo-white.png';

const Login = () => {

  // useEffect is a magic function that knows it's in the Login component and then only runs once the Login component
  // has been rendered
  useEffect(() => {

    // this is a function that gets us the google script
    const loadGoogleScript = () => {
      // making the script an element is a simple way to load it after the page has already been loaded.
      // by adding it to the dom, we automatically execute the script at https://accounts.google.com/gsi/client

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      // there's some magic thing where this runs as soon as script is loaded, and it's fine being naked.
      script.onload = initializeGoogleSignIn;
    };

    loadGoogleScript();
  }, []);

  // so we've said that as soon as the component is loaded we'll loadGoogleScript. Okay, so far so good.

  const initializeGoogleSignIn = () => {
    // the google script, once it's loaded
    // adds a "google" key to the window object.

    window.google.accounts.id.initialize({
      // initialize  creates a client that you can use to communicate
      // with google
      client_id: process.env.REACT_APP_GOOGLE_API_TOKEN,
      callback: handleGoogleSignIn
    });
  };

  const handleGoogleSignIn = (response) => {    
    // response obj is passed in automatically by google when its called on line 42
 
    const { credential } = response;
    // semantically equivalent to const credential = response.credential

    const payload = credential ? JSON.parse(atob(credential.split('.')[1])) : null;

    if (payload) {
      localStorage.setItem('user', JSON.stringify(payload));

      const { name, sub: googleId, picture: imageUrl } = payload;

      const doc = {
        _id: googleId,
        _type: 'user',
        userName: name,
        image: imageUrl,
      }
    }
  };

  const signIn = () => {
    window.google.accounts.id.prompt();
  };

  // this is the actual UI of the page
  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className='relative w-full h-full'>
        <video
          src={violinVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className='w-full h-full object-cover'
        />
      </div>
      <div className='absolute flex flex-col justify-center items-center top-0 left-0 right-0 bottom-0 bg-blackOverlay'>
        <div className='p-5'>
          <img src={logo} width="130px" alt="logo" />
        </div>
        <div className='shadow-2xl'>
          <button
            type="button"
            className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
            onClick={signIn}
            // aha! here it is!. So yeah, we just say that on click, we generate the gogle UI prompt
          >
            <FcGoogle className='mr-4' /> Sign in with Google
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
