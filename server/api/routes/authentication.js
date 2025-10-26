import config from "../../utils/config.js";
import constructLog from "../../utils/logger.js";
import { create_user_otp } from "../../functions/otp-generator.js";
import express from "express";
import {check_code, get_user_cookie, get_user_data, get_otp_user, send_error, token_handshake} from "../../functions/api-functions.js";
import "../../utils/types.js"

const log = constructLog("Auth API")
export const auth_router = express.Router();

// Gets the redirect url for the given provider
auth_router.get("/sign-in/oauth/:provider", async (req, res) => {
  const provider = req.params.provider;
  log.info(`Getting url for ${provider}`)
  try{
    const redirect_url = config.oauth[provider].get;
    res.redirect(redirect_url)
  } catch {
    log.error(`${provider} is not a provider`)
    res.status(400).send({
      error: {
        code: "unknown_provider", 
        message: "The chosen provider is not known"
      }
    })
  }
  
})

// Handles the handshake for the provider and token
auth_router.get("/sign-in/oauth/handshake/:provider/:token", async (req, resp) => {
  // perform the handshake with the provider
  const provider = req.params.provider;
  const token = req.params.token;
  
  const handshake_response = await token_handshake(provider, token);
  if(handshake_response.error){return send_error(handshake_response.error, resp)};

  const user_data_response = await get_user_data(provider, handshake_response.data);

  if(user_data_response.error){return send_error(user_data_response.error, resp)}

  const user_cookie = get_user_cookie(user_data_response.data);

  if (user_cookie.error){
    resp.status(400).send(user_cookie.error);
  } else {
    resp.status(200).cookie('grassroots', user_cookie.data).send({data:"Cookie Set"});
  }
})

// Handles OTP sign on by emailing the user with the link
auth_router.get("/sign-in/otp", async (req, resp) => {
  const error = {error:{code:"email_unset", message: "Email not set in message headers"}}
  const email = req.headers.authentication;
  if (email == undefined){return send_error(error, resp)}
  
  const otp_return = await create_user_otp(email);
  if (otp_return.error){return send_error(otp_return.error, resp)}

  resp.status(200).setHeader(
    'Authorization', otp_return.data.unique_id
  ).send();
})

// Handles verification of the OTP
auth_router.get("/sign-in/otp/:code", async (req, resp) => {
  const unique_id = req.headers.authorization;
  const code = req.params.code;

  const checked_code = await check_code(unique_id, code);
  if (checked_code.error){return send_error(check_code.error, resp)}
  
  const check_otp = await get_otp_user(unique_id);
  if (check_otp.error){return send_error(check_otp.error, resp)}

  if (!check_otp.data.username){
    resp.status(200).send({new_user: true});
    return;
  }

  const user_cookie = await get_user_cookie(check_otp.data.username);
  if (user_cookie.error){return send_error(user_cookie.error, resp)}
  
  resp.status(200).cookie('grassroots', user_cookie.data).send({
    new_user: true
  });
})