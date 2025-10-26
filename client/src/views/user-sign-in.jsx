import { DeleteLoginId, SetLoginId } from "../functionality/session-storage";
import { FaApple, FaGoogle, FaGithub, FaMicrosoft}  from "react-icons/fa";
import { InitialiseOauth, InitialiseOTPAuth } from "../functionality/api";
import { PageContent, PageElement } from "../components/multiuse-elements";
import styles from "../css/authentication.module.css";
import { useState } from "react";
import "../functionality/types";

function HandleResponse(resp, setErrorLine){
  const {error, data} = resp;
  if (error) {
    DeleteLoginId()
    setErrorLine("Error error while signing in - please try again!")
    console.error(`[${error.status}] ${error.code}: ${error.message}`);
    return;
  }
  const redirectLocation = data.referral_url ? data.referral_url : "/sign-in/auth/otp"
  window.location.href = redirectLocation;
}

async function OAuthHandshake(provider, setErrorLine){
  const resp = await InitialiseOauth(provider);
  HandleResponse(resp, setErrorLine)
}

/** Verifies the email address entered by the user against an email regex and sends it to the API to initiate sign in */
async function VerifyEmail(e, setErrorLine){
  const email = e.get('email');
  const re = /[\d\w]+@[\w]+\.(?:(?:com)|(?:gov|co|edu|ac)\.uk)/;
  if(!re.test(email)){
    setErrorLine("It looks like there's an error with that email address! Currently we only accept .com or .uk emails");
    return
  }
  SetLoginId(email)
  const resp = await InitialiseOTPAuth(email);
  HandleResponse(resp, setErrorLine)
}

/** Render the sign in page
 * @returns {React.ReactElement}  */
export default function SignIn(){
  const [errorLine, setErrorLine] = useState('');
  /** The possible OAuth Methods */
  const authMethods = {
    apple: <FaApple />,
    github: <FaGithub />,
    google: <FaGoogle />,
    microsoft: <FaMicrosoft />
  }
  const oauthButtons = (
    Object.entries(authMethods).map(([provider, icon]) => (
      <button onClick={()=>(OAuthHandshake(provider, setErrorLine))} key={provider}>
        {icon}
      </button>
    )
  ))
  const oauthSignIn = (
    <div className={styles.oauthContainer}>
      <h4>Use OAuth</h4>
      <div>{oauthButtons}</div>
    </div>
  )
  const emailSignIn = (
    <div className={styles.emailContainer}>
      <h4> Use Email </h4>
      <form action={(e) => VerifyEmail(e, setErrorLine)}>
        <input type="text" name="email" />
        <button type="submit">Sign In</button>
      </form>
    </div>
  )
  return(
    <PageContent page="sign-in">
      <PageElement>
        {emailSignIn}
        {oauthSignIn}
        <p>{errorLine}</p>
      </PageElement>
    </PageContent>
  )
}