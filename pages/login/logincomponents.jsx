"use client";
import React, { use } from "react";
import {auth, googleprovider, githubProvider} from '../../firebase/firebase'
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider} from "firebase/auth";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useRouter } from 'next/navigation';

function writeUserData(userId, name, email, city) {
  const db = getDatabase();
  set(ref(db, "users/" + userId), {
    username: email,
    email: email,
    city: "No City"
  });
} 

export function GoogleLogin(){
  const router = useRouter();
  const [isGoogleHover, setIsGoogleHover] = React.useState(false);


  const SignAuthGoogle = () => {
    signInWithPopup(auth, googleprovider)
      .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;
      // The signed-in user info.
      // const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      writeUserData(result.user.uid, result.user.email, result.user.email, "No City");
      router.push('./mainpage/roadmap');
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
      alert(errorMessage);
    });
  }
  return (
    <img
      className= {isGoogleHover ? "onIcon" : "notOnIcon"}
      width= {40}
      height= 'auto'
      src={'../google-color-icon.svg'}
      alt={"sign in with google"}
      onMouseEnter={() => setIsGoogleHover(true)}
      onMouseLeave={() => setIsGoogleHover(false)}
      onClick={SignAuthGoogle}
    />
  );
}  

export function GitHubLogin(){
  const router = useRouter();
  const [isGitHover, setIsGitHover] = React.useState(false);

  const SignAuthGitHub = () => {
    signInWithPopup(auth, githubProvider)
    .then((result) => {
      // ...
    writeUserData(result.user.uid, result.user.email, result.user.email, "No City");  
    router.push('./mainpage/roadmap');
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GithubAuthProvider.credentialFromError(error);
    // ...
    alert(errorMessage);
  });
  }
  
  return (
    <img
      className= {isGitHover ? "onIcon" : "notOnIcon"}
      width= {50}
      height= 'auto'
      src={'../icone-github-bleu.png'}
      alt={"sign in with github"}
      onMouseEnter={() => setIsGitHover(true)}
      onMouseLeave={() => setIsGitHover(false)}
      onClick={SignAuthGitHub}
    />
  );
}   


export function SignUp(){
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordConfirm, setPasswordConfirm] = React.useState("");
  const router = useRouter();
    
  const SignUpAuth = () => {
    if(password === passwordConfirm){
      createUserWithEmailAndPassword(auth, email , password)
      .then((userCredential) => {
        // Signed up 
        //writeUserData(userCredential.user.uid, userCredential.user.email, userCredential.user.email, "No City");  
        router.push('./mainpage/main');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
        // ..
      });
    } else {
      alert("Passwords do not match");
    }
  }

  return [
    <h1 key="title">Sign Up!</h1>,
    <TextField
      key="email"  
      className="textinput"
      required
      label="Email Address"
      placeholder="Enter your email address"
      onChange={(event) => setEmail(event.target.value)}
    />,
    <TextField
      key="password"
      className="textinput"
      required
      label="Password"
      type="password"
      autoComplete="current-password"
      onChange = {(event) => setPassword(event.target.value)}  
    />,
    <TextField
      key="passwordconfirm"
      className="textinput"
      required
      label="Confirm Password"
      type="password"
      autoComplete="current-password"
      onChange = {(event) => setPasswordConfirm(event.target.value)}
    />,
    <Button key="submit" variant="contained" className="textinput" onClick={SignUpAuth}>
      Sign Up
    </Button>
  ];
}


export function SignIn() {
  
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();
  
  const SingInAuth = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        router.push('./mainpage/roadmap');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  }

  return [
    <h1 key="title">Sign In!</h1>,
    <TextField
      key="email"
      className="textinput"
      required
      label="Email Address"
      placeholder="Enter your email address"
      onChange={(event) => setEmail(event.target.value)}
    />,
    <TextField
      key="password"
      className="textinput"
      required
      label="Password"
      type="password"
      autoComplete="current-password"
      onChange={(event) => setPassword(event.target.value)}
    />,
    <Button key="submit" variant="contained" className="textinput" onClick={SingInAuth}>
    Sign In
    </Button>
  ];
}


export default function exportDefault() {
 return (<> </>);
}