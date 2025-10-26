/** Set a value within session storage
 * @param {string} key The key of the data to be stored
 * @param {string} value The value to be stored */
function SetSessionStorageItem(key, value){
  window.sessionStorage.setItem(key, value);
}
/** Get a value from session storage 
 * @param {string} key The key of the value to get
 * @returns {(string | null)} The value retrieved from the session storage for that key */
function GetSessionStorageItem(key){
  return window.sessionStorage.getItem(key)
}
/**
 * Delete an item from session storage with the provided key
 * @param {string} key The key of the data to delete 
 */
function DeleteSessionStorageItem(key){
  window.sessionStorage.removeItem(key);
}

/** Checks to see if the user is signed in by returning a boolean based on the presence of their JWT */
export function TouchJWT(){
  return GetSessionStorageItem('jwt_refreshToken');
}

// Getters
/** Get the user's stored username */
export function GetUsername(){
  return GetSessionStorageItem('username')
}
/** Get the user's stored sessionid */
export function GetSessionId(){
  return GetSessionStorageItem('sessionId');
}
/** Get the user's stored refresh token */
export function GetRefreshJWT(){
  return GetSessionStorageItem('jwt_refreshToken');
}
/** Get the user's stored email */
export function GetLoginId(){
  return GetSessionStorageItem('loginId')
}

// Setters
/** Set a session id to session storage for the user */
export function SetSessionId(){
  const sessionId = crypto.randomUUID();
  SetSessionStorageItem('sessionId', sessionId)
}
/** 
 * Set the JWTs in session storage
 * @param {JWTs} jwts The JWTs returned by the API
 */
export function SetJWTs(jwts){
  SetSessionStorageItem("jwt_sessionToken", jwts.session)
  SetSessionStorageItem("jwt_refreshToken", jwts.refresh)
}
/** 
 * Set the user's username is session storage
 * @param {string} username The user's username
 */
export function SetUsername(username){
  SetSessionStorageItem("username", username)
}
export function SetAccountType(accountType){
  SetSessionStorageItem("accountType", accountType)
}
/** 
 * Set the user's email is session storage
 * @param {string} email The user's email
 */
export function SetLoginId(loginId){
  SetSessionStorageItem('loginId', loginId)
}
/** Delete the user's data from the session */
export function DeleteUserDetails(){
  DeleteSessionStorageItem('jwt_refreshToken');
  DeleteSessionStorageItem('jwt_sessionToken');
  DeleteSessionStorageItem('username')
}
/** Delete the user's email from the session storage */
export function DeleteLoginId(){
  DeleteSessionStorageItem('loginId')
}


