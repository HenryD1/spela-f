
// Just importing stuff
import React, { useEffect } from 'react'
import { FcGoogle } from 'react-icons/fc';
import violinVideo from '../assets/violin.mp4';
import logo from '../assets/volley-logo-white.png';


// Okay, so this is a function that defines a login component. It includes both our video and the google login component inside it.
const Login = () => {

  // So this calls useEffect with a callback argument that is named loadGoogleScript. The main thing loadGoogleScript does is initialize googlesignin
  // it only initializes googlesignin on load
  // wait I have a question. this function waits a certain amount of time to run because its a callback of course, but wouldn't you want script.onload
  // to be in an async function itself? Because it's waiting for something to load?
  // but this function isn't **in** an async function, it's just the synchronous callback for when the function **does load** wassup??
  
  // useEffect is a magic function that knows it's in the Login component and then only runs once the Login component
  // has been rendered
  useEffect(() => {

    // this is a function that gets us the google script
    const loadGoogleScript = () => {
      // making the script an element is a simple way to load it after the page has already been loaded.
      // by adding it to the dom, we automatically execute the script at https://accounts.google.com/gsi/client
      // 
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      // there's some magic thing where this runs as soon as script is loaded, and it's fine being naked.
      console.log(' we are about to send off onload initialize googlesignin')
      script.onload = initializeGoogleSignIn;
    };

    loadGoogleScript();
  }, []);

  // so we've said that as soon as the component is loaded we'll loadGoogleScript. Okay, so far so good.

  // now we define a function called initializeGoogleSignIn that takes a callback
  // the callback runs this built in window function called window.google.accounts.id.initialize
  // which takes as arguments the client_id
  // and a callback called handleGoogleSignin


  // Okay I have several questions
  // 1. How can we call handleGoogleSignIn before we define it? Is js cool with that? what is function hoisting?
  // what's the point of defining this function as taking a callback?
  // oh I get it, it doesn't take a callback. This is just javascript arrow notation.
  // why does the window have a .google property? I thought google was a third party and window was native to the browser
  
  // this function gets called as soon as the google login script has been loaded (its called via event handler)
  
  // so it runs window.google.accounts.id.initialize. So yeah the real question here is of course: 
  // how does the window have a google function
  const initializeGoogleSignIn = () => {
    // the reason that this is added (and potentially a key to debugging my problem) is that the google script, once it's loaded
    // adds a "google" key to the window object. this is normal, apparently we're all out here adding shit
    // to the dom. adding it to window is common practice for third-party libraries to make functionality
    // globally accessible

    // so the next question is of course: what does initialize actually do? it creates a client that you can use to communicate
    // with google. client just being like a separate entity that acts as a specialized tool your browser can use

    console.log(' were about to call intiialize')
    //console.log(window.google.accounts.id)
    //console.log('Client ID:', process.env.REACT_APP_GOOGLE_API_TOKEN);
    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_API_TOKEN,
      callback: handleGoogleSignIn
    });
  };

  // Okay, so next we define handleGoogleSignIn. This is necessary because we call this as the callback of initializeGoogleSignIn, 
  // which is itself called as soon as the google script is loaded. 


  // let's see what handleGoogleSignIn does
  const handleGoogleSignIn = (response) => {
    console.log ('we have now called handlegoogleSignIn')
    // we define something in a {}. what tf does that mean? Does it mean that it's an object maybe?
    
    // so handleGoogleSignIn takes response as an argument. this is surprising because when we call it on line 69, 
    // when  the initialize function calls this callback, it will automatically pass the response as an argument.
    // so we can rest assured that we get the response object.\

    // this is a destructuring. I believe that means that response will have a bunch of keys, and we only
    // grab the credential key. is that correct?

    const { credential } = response;

    console.log('response from google is', response)

    // this defines a variable called credential, which is the repsonse.credential key
    // this would be more useful if it was like 5 variables
    // this is equivalent to writing const credential = response.credential;

    //okay, now two javascript classics: parsing a payload and null. so yeah we just grab a payload here
    const payload = credential ? JSON.parse(atob(credential.split('.')[1])) : null;

    console.log(' we just destructured the payload')

    if (payload) {
      console.log('response from google is', payload);
      //if we have a payload, then we save the payload to local storage. 
      localStorage.setItem('user', JSON.stringify(payload));


      const { name, sub: googleId, picture: imageUrl } = payload;

      // this is the doc that we'll send over to sanity
      const doc = {
        _id: googleId,
        _type: 'user',
        userName: name,
        image: imageUrl,
      }
      // Here you can add logic to save the user to your backend
    }
  };
  // ok word, that wa the handlegooglesignin function. thanks everyone.

  // okay, now for the signin function. this literally just generates the UI for signing in. where does this get called. 
  // I would hope by the main compoenent function as soon as script is loaded. maybe we'll see it called down here in the ui definition
  const signIn = () => {
    window.google.accounts.id.prompt();
  };

  // okay, onto the actual structure of the page (we've done all the setup at this point)
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
