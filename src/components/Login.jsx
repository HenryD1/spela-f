
// Just importing stuff
import React, { useEffect } from 'react'
import { FcGoogle } from 'react-icons/fc';
import violinVideo from '../assets/violin.mp4';
import logo from '../assets/volley-logo-white.png';


// Okay, so this is a function that defines a login component. It includes both our video and the google login component inside it.
const Login = () => {

  // This gets us a magic "navigate" function that we can call with an argument that is a page and then it takes us to that page. It's not called anywhere.
  // I'm gonna delete it.l

  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = initializeGoogleSignIn;
    };

    loadGoogleScript();
  }, []);

  const initializeGoogleSignIn = () => {
    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_API_TOKEN,
      callback: handleGoogleSignIn
    });
  };

  const handleGoogleSignIn = (response) => {
    const { credential } = response;
    const payload = credential ? JSON.parse(atob(credential.split('.')[1])) : null;
    
    if (payload) {
      console.log('response from google is', payload);
      localStorage.setItem('user', JSON.stringify(payload));
      const { name, sub: googleId, picture: imageUrl } = payload;

      const doc = {
        _id: googleId,
        _type: 'user',
        userName: name,
        image: imageUrl,
      }
      // Here you can add logic to save the user to your backend
    }
  };

  const signIn = () => {
    window.google.accounts.id.prompt();
  };

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
          >
            <FcGoogle className='mr-4' /> Sign in with Google
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
