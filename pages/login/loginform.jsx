import { SignIn, SignUp , GoogleLogin, GitHubLogin} from "./logincomponents";
import Button from "@mui/material/Button";
import React from "react";

export default function LoginForm() {

const [isSignUp, setIsSignUp] = React.useState(false);
return (
      <main className="main">
        <div className="form">
          <div className="formtop">  
            {isSignUp && <SignUp/>  || <SignIn/>}
          </div>
          <div className="formmiddle">
          {isSignUp ?  
            <Button
              id="signininstead"
              variant="text"
              className="textinput"
              onClick={() => setIsSignUp(false)}
            >
              Sign In Instead!
            </Button>
            :
            (
              <>
              <Button
                id="signupinstead"
                variant="text"
                className="textinput"
                onClick={() => setIsSignUp(true)}
              >
                Sign Up Instead!
              </Button>
              <Button
                id="forgotpassword"
                variant="text"
                className="textinput"
              >
                Forgot Password?
              </Button>
              </>
            )
          }
          </div>
          <div className="formbottom">
          <GoogleLogin />
          <GitHubLogin />
          </div>
        </div>
      </main>
);
}