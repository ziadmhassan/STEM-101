import ResponsiveAppBar from "./appbar";
import { onAuthStateChanged, User} from "firebase/auth";
import { auth } from "../../firebase/firebase";
import React, { useState, useEffect, useRef } from "react";
import '../../src/app/globals.css';
import { useRouter } from 'next/navigation';
import { Button } from "@mui/material";
import { captureImage } from "../../script/script";
import Result  from "../../script/script";

export default function Home() {  
    const [authUser, setAuthUser] = useState(null)
    
    const router = useRouter()

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
          if (user) {
            setAuthUser(user)
            console.log(user.email)
          } else {
            setAuthUser(null)
            router.push('/')
          }
        })
      })
    return(
        <div className="homepage">
            <ResponsiveAppBar></ResponsiveAppBar>
            <div className="mainpagebody">
                <Button onClick={captureImage}>TEST</Button>
                <Result></Result>
            </div>
        </div>
    );
}
