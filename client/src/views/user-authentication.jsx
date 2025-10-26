import { ExchangeAuthCode, ExchangeOTP, SignUserOut } from "../functionality/api";
import { Loader, NavButton, PageContent, PageElement } from "../components/multiuse-elements";
import { DeleteUserDetails, SetJWTs, SetUsername, SetAccountType } from "../functionality/session-storage";
import styles from "../css/authentication.module.css";
import { useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import "../functionality/types";

/** Handle the API Response
 * @param {APIResponse} resp The response from the API
 * @param {function} setErrorLine Set the error line on the relevant page
 * @param {function} setIsLoading Set the relevant page to be loading/stop loading
 */
function HandleResponse(resp, setErrorLine, setIsLoading){
  const {error, data} = resp;
  // If the API returned an error then handle it accordingly
  if(error){
    if (error.code == "E061104"){
      setErrorLine("Oops - looks like that code has expired");
    } else if(error.code == "E061103"){
      setErrorLine("Oops - looks like you've tried too many times with that code");
    } else {
      setErrorLine("Looks like there was an error!");
    }
    console.log(`[${error.status}] ${error.code}: ${error.message} `)
  } else if (data) {
    const {jwts, userData} = data;
    SetJWTs(jwts);
    if (!userData.firstSeen && userData.username){
      SetUsername(userData.username);
      SetAccountType(userData.accountType);
      window.location.href = "/user/profile";
    } else {
      window.location.href = "/sign-in/create";
    }
  }
  setIsLoading(false);
}
/** Renders the OAuth Page or redirects the user to the relevant sign in page
 * @returns {React.ReactElement}
 */
function AuthOAuth(){
  const [searchParams, _] = useSearchParams();
  const [errorLine, setErrorLine] = useState(false);
  const [isLoading , setIsLoading] = useState(true);
  const token = searchParams.get("code");
  async function ExchangeTokens(){
    const resp = await ExchangeAuthCode(token);
    HandleResponse(resp, setErrorLine, setIsLoading)
  }
  ExchangeTokens()
  return (
    <PageContent>
      {errorLine &&
        <PageElement>
          <p>{errorLine}</p>
          <NavButton content={{link:'/sign-in', title:'Go Back'}} />
        </PageElement>
      }
    </PageContent>
  )
}
/** Render the OTP Screen for when email/otp is chosen as the login method
 * @returns {React.ReactElement} The OTP Screen
 */
function AuthOTP(){
  const [isLoading, setIsLoading] = useState(false);
  const [errorLine, setErrorLine] = useState(false);
  const [errorRaised, setErrorRaised] = useState(false);
  /** An array of length 6, with each item being a reference that is then linked to an input cell */
  const inputRefs = Array.from({length:6},(v,k)=>useRef(null));
  /** Check to see if the verification code is complete yet */
  function checkCode(){
    /** Submit the code to the API, and handle the API's response
     * @function submitCode
     * @param {string} code the code entered by the user */
    async function submitCode(code){
      setIsLoading(true);
      const resp = await ExchangeOTP(code);
      HandleResponse(resp, setErrorLine, setIsLoading)
    };

    const code = inputRefs.map((r) => r.current.value);
    // filter the code for only integers
    if(code.filter((value) => /[0-9]/.test(value)).length == 6){
      submitCode(code.join(''))
    } 
  };

  /** format the cell with index i and raise an error depending on if the input if valid
   * @param {int} i - the index of the cell
   * @param {bool} isValid - if the content of cell i is valid */
  function formatCell(i, isValid){
    inputRefs[i].current.className = isValid ? styles.input : styles.badInput ;
    setErrorRaised(!isValid)
  }
  /** Handle when a use inputs a value into a cell. 
   * If the value is a keypress, handle only backspaces
   * If the value is a string, check it is a int then add to the code. 
   * @param {Object} e the reference from the input box; either Keyboard Event or ChangeEvent
   * @param {int} i the index of the cell being handled*/
  function handleInput(e, i){
    if (e.keyCode){
      if (e.keyCode == 8){
        formatCell(i, true)
        !e.target.value && i>0 && inputRefs[i-1].current.focus()
      }
    } else if (e.target.value){
      /** @type {boolean} if the value is between 0-9 and therefore valid */
      const isValid = /[0-9]/.test(e.target.value)
      formatCell(i, isValid)
      if (isValid){
        checkCode();
        i<5 && inputRefs[i+1].current.select();
      }
    }
  };

  return (
    <PageContent page="sign-in-otp">
      <PageElement subclass={styles.otpContainer}>
        <div>
          {Array.from({length:6},(v,k)=>k).map((i) => (
            <input
              className={styles.input}
              key={i} type="string"
              maxLength={1} ref={inputRefs[i]}
              autoFocus={i === 0} onFocus={(e)=>{e.target.select()}}
              onKeyDown={(e) => handleInput(e, i)}
              onChange={(e) => handleInput(e, i)}
            />
          ))}
        </div>
        <p className={`${styles.codeError} ${errorRaised && styles.codeErrorActive}`}>
          please ensure you enter only numbers
        </p>
      </PageElement>
      { isLoading && Loader }
      { errorLine &&
        <PageElement subclass={styles.otpError}>
          <p>{errorLine}</p>
          <NavButton content={{link:'/sign-in', title: 'Try Another Method'}} />
        </PageElement>
      }
    </PageContent>
  )
}
/** Handle the authentication method that is to be used by using the URL parameters
 * @return {React.ReactElement} Returns a page element if there is an issue rendering the correct auth page
 */
export function SignInAuth(){
  const params = useParams();
  if(params.authType.toLowerCase()=='otp'){
    return AuthOTP()
  } else if (params.authType.toLowerCase()=='oauth'){
    return AuthOAuth()
  } else{
    return(
      <PageContent page={{heading:`Auth Page ${params.authType} Unrecognised`}} />
    )
  }
}
/** Sign the user out and return them to the home page */
export function SignOut(){
  const [errorMessage, setErrorMessage] = useState();
  
  /** Sign the user out */
  async function PerformSignOut(){
    const resp = await SignUserOut();
    if (resp.error){
      const error = resp.error;
      setErrorMessage("looks like we can't sign you out right now - try again soon!");
      console.error(`[${error.status}] ${error.code}: ${error.message}`)
    } else {
      DeleteUserDetails();
      window.location.href = '/';
    }
  }
  return (
    <PageContent>
      <PageElement subclass={styles.signOut}>
        <h2> Are you sure you wish to sign out? </h2>
        <div className={styles.signOutButtons}>
          <button onClick={()=>(window.location.href = "/")}>
            Go Back
          </button>
          <button className={styles.signout} onClick={()=>PerformSignOut()}>
            Yes, Sign Out
          </button>
        </div>
        <p>{errorMessage}</p>
      </PageElement>
    </PageContent>
  )
}