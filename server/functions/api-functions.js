import axios from "axios";
import config from "../utils/config.js";
import constructLog from "../utils/logger.js";
import { sql_select, sql_update } from "./sql-handler.js";
import "../utils/types.js"

const log = constructLog("API Functions");

export function send_error(error, resp){
  resp.status(400).send({error: error});
  return
}

/** Performs the handshake with the provider to verify the code
 * @param {string} provider The provider the token has come from
 * @param {string} token The token returned by the provider
 * @returns {APIReturn} The return to be sent to the user */
export async function token_handshake(provider, token){
  log.info(`Initialising handshake for ${provider}`);
  let handshake;
  try{
    handshake = config.oauth[provider].handshake;
  } catch {
    log.error("Could not get handshake data for "+ provider);
    return {error: {code: "provider_unknown", message:"Could not establish handshake with that provider"}}
  }
  
  const params = {
    client_id: handshake.client_id,
    client_secret: handshake.client_secret,
    code: token
  }
  const resp = await axios.get(handshake.url, {params: params, headers: handshake.headers})
  const data = resp.data;
  if (data.error){
    const error = {code: data.error, message: data.error_description}
    log.error(`Received error ${error.message} from ${provider} when performing handshake`)
    return {error: error, data: false}
  } else {
    log.info(`Received response from ${provider}`)
    console.log(data)
    return {error: false, data: data}
  }
}

/** Gets user data from the provider
 * @param {string} provider The provider to get the data from
 * @param {object} data The data returned by the provider during the handshake
 * @returns {APIReturn} The return to be sent to the user */
export async function get_user_data(provider, data){
  log.info(`Getting user info from ${provider}`);
  const {referral_url, accept_type} = config.oauth[provider].get_user;
  let resp;
  try{
    resp = await axios.get(referral_url, {
      'Authorization': `Bearer ${data.access_token}`,
      'Accept': 'application/'+accept_type,
    })
  } catch {
    log.error(`Could not get user data from ${provider}`)
    return {error: {code: "user_error", message: "Could not get user info from provider"}}
  }

  if (resp.error){
    log.error(`Received error ${resp.error.message} from ${provider} when getting user information`)
    return {error: resp.error, data: false};
  } else {
    return {error: false, data: resp.data};
  }
}

/** Creates the user cookie
 * @param {object} data The user's data
 * @returns {APIReturn} The return to be sent to the user */
export function get_user_cookie(username){
  log.info(`Creating cookie for user`);
  const date_now = new Date.now();
  const date_expires = date_now.add(30).days();
  const cookie = `Username=${username};CookieStart=${date_now};CookieExpires=${date_expires};`
  return {error: false, data: {cookie: cookie}}
}

/** Checks the code entered by the user to see if it is correct
 * @param {string} unique_id The unique id of the db entry for the code
 * @param {string} code The code entered by the user
 * @returns {APIReturn} The return to be sent to the user */
export async function check_code(unique_id, code){
  const resp = await sql_select({
    select: "request_value",
    from: "user_sign_in_requests",
    where: `request_id=${unique_id}`
  });
  if (resp.error){
    return resp
  }
  if (resp.data[0][0].request_value == code){
    const updated_line = await sql_update({
      table: "user_sign_in_requests",
      set: "sign_in_complete = true",
      where: `request_id = ${unique_id}`
    })
    return updated_line;
  } else {
    return {
      error: {code: "code_incorrect", message: "The code entered is incorrect!"},
      data: false
    }
  }
}

export async function get_otp_user(unique_id){
  const get_email_query = {
    select: 'user_attribute',
    from: 'user_sign_in_requests',
    where: `request_id=${unique_id}`
  }
  const sql_email_return = await sql_select(get_email_query);
  const user_email = sql_email_return.data[0][0].user_attribute;
  const get_username_query = {
    select: 'username',
    from: 'users',
    where: `email_address='${user_email}'`
  }
  const sql_username_return = await sql_select(get_username_query);
  const username = sql_username_return.data[0];
  if (username.length > 0){
    return {error: false, data: {username: username[0]}}
  } else{
    return {error: false, data: {username: false}}
  }
}