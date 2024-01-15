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

    const getNumberffDailyAcesses = () => {
      fetch('http://localhost:4000/get_access_count')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setDailyAccessCount(data.daily_access_count);
        })
        .catch(error => {
          alert('Error: ' + error.message);
          console.error('Error fetching data:', error);
        });  
    };

    const [authUser, setAuthUser] = useState(null)
    const [imageFile, setImageFile] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const [daily_access_count, setDailyAccessCount] = useState(0);
  
    const router = useRouter()

    const handleImageChange = (event) => {
      const file = event.target.files[0];
      setImageFile(file);
    };
  
    const handleAudioChange = (event) => {
      const file = event.target.files[0];
      setAudioFile(file);
    };
    
    useEffect(() => {
      const listen = onAuthStateChanged(auth, (user) => {
        if (user) {
          setAuthUser(user);
          console.log(user.email);
        } else {
          setAuthUser(null);
          router.push('/');
        }
      });

      // Call the Flask server on each render
      getNumberffDailyAcesses();
    }, [router]);

    return(
        <div className="homepage">
            <ResponsiveAppBar></ResponsiveAppBar>
            <div className="mainpagebody">
              <label
                htmlFor="Number of Daily Accesses"
                style={{ fontFamily: 'Lato', fontSize: '1.5rem' }}
              >
                  Number of Daily Accesses: {daily_access_count}
              </label>
              <Button 
                variant="contained"
                color="primary" 
                onClick={captureImage}
                style={{ width: '70%' }}
              >
                  Press to capture image
              </Button>
              <Result></Result>
              <div className="uploadNewData">
                <div className="uploadParition">
                  <label 
                    htmlFor="imageInput"
                    style={{ fontFamily: 'Lato', fontSize: '1.5rem' }}
                  >
                      Choose an image
                  </label>
                  <input
                    type="file"
                    id="imageInput"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ width: '75%' }}
                  />
                </div>
                <div className="uploadParition">
                  <label
                    htmlFor="audioInput"
                    style={{ fontFamily: 'Lato', fontSize: '1.5rem' }}
                  >
                      Choose an audio file
                  </label>
                  <input
                    type="file"
                    id="audioInput"
                    accept="audio/*"
                    onChange={handleAudioChange}
                    style={{ width: '75%' }}
                  />
                </div>
              </div>
            </div>
        </div>
    );
}


