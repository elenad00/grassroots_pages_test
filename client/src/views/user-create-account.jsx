
import { CheckUsername, SetUserDetails} from "../functionality/api";
import { PageContent, PageElement } from "../components/multiuse-elements";
import styles from "../css/authentication.module.css";
import { useState } from "react";
import "../functionality/types";
import { DeleteLoginId, SetAccountType, SetUsername } from "../functionality/session-storage";

/** Create the user's account using their preferred username */
export default function CreateAccount(){
  const [errorLine, setErrorLine] = useState();
  async function CreateUser(e){
    // stops the page from refreshing
    e.preventDefault()
    const username = (e.target.elements.username.value).toString().toLowerCase();
    const accountType = (e.target.elements.accountType.value).toString().toLowerCase();

    // Check the username against the username regex
    const usernameRegex = /[0-9a-z]{5,12}/;
    if(!usernameRegex.test(username)){
      setErrorLine("Usernames can only contain letters and numbers and must be between 5 and 12 characters long");
      return;
    }
   
    // Check that the user has selected what account type they would like
    if(!accountType){
      setErrorLine("Please select your account type!");
      return;
    }
   
    // Check the username doesn't already exist
    const checkResp = await CheckUsername(username);
    if(checkResp.error){
      setErrorLine("Our bad - looks like we can't validate that username right now");
      console.error(`[${checkResp.error.status}] ${checkResp.error.code}: ${checkResp.error.message}`);
      return;
    } else if(!checkResp.data.usernameFree){
      setErrorLine("That username's taken - try something else");
      return;
    }
    // Update the user's username and set their role
    const setResp = await SetUserDetails(username, accountType);
    let {error, data} = setResp;
    if(error){
      setErrorLine("Huh, looks like we can't create your account right now - try again later!");
      console.error(`[${error.status}] ${error.code}: ${error.message}`);
    } else{
      SetUsername(data.customAttributes.username)
      SetAccountType(data.customAttributes.accountType);
      DeleteLoginId()
      window.location.href = "/user/profile";
    }
  }

  return(
    <PageContent page="sign-up">
      <PageElement>
        <form onSubmit={CreateUser} className={styles.createUser}>
          <div className={styles.createUserElement}>
            <h3>Username</h3>
            <input type="text" name="username"/>
            </div>
          <div className={styles.createUserElement}>
            <h3> I am a...</h3>
            <select name="accountType" className={styles.accountType}>
              {['Fan','Artist','Venue'].map((type) => (
                <option value={type}>{type}</option>
              ))}
            </select>
          </div>
          <button type="submit">Sign Up!</button>
          <p>{errorLine}</p>
        </form>
      </PageElement>
    </PageContent>
  )
}