import config from "../utils/config.js";
import constructLog from "../utils/logger.js";
import nodemailer from "nodemailer";
import "../utils/types.js";

const log = constructLog("Email Server");

/** Creates and returns the SMTP Email Server
 * @returns {nodemailer.Transport} */
function EmailTransporter(){
  const transport =  nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 587,
    secure: false,
    auth: {
      user: config.email.username, 
      pass: config.email.password
    }
  })
  return transport;
}

/** Constructs an email to send to the user
 * @param {string} emailAddress The user's email
 * @param {string} subject The email's subject
 * @param {string} content The content of the email
 * @returns {EmailReturn} The constructed email
 */
function EmailContent(emailAddress, subject, content){
  return {
    from: config.email.auth_email,
    to: emailAddress,
    subject: subject,
    text: content
  }
}
/**
 * Sends the OTP code to the given email address
 * @param {string} email The email to send the code to
 * @param {string} code The code generated for the user
 * @returns {APIReturn} The data to return to the UI
 */
export default async function send_user_code(email, code){
  const emailTransporter = EmailTransporter();
  const emailContent = EmailContent(
    email, 
    "Your Grassroots Auth Code", 
    `Hey there!\nYou recently tired to sign into Grassroots with this email address.\nYour verification code is ${code}\nIt will expire in five minutes!`
  )
  // Send the email
  let email_response;
  try{
    email_response = await emailTransporter.sendMail(emailContent);
  } catch (err){
    log.error("Could not send email - "+err)
    return {error: {code: "email_error", message: "Email to user could not be sent"}}
  }

  if (email_response.rejected.length > 0) {
    log.error(`Error sending email`)
    return {error: email_response, data: false};
  } else {
    return {error: false, data: true};
  }
}