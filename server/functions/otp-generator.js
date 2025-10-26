import constructLog from "../utils/logger.js";
import send_user_code from "./email-server.js";
import { sql_insert, sql_select } from "./sql-handler.js";
import "../utils/types.js";

const log = constructLog("OTP Handler");

/**
 * Generates a 6 letter OTP for the user
 * @returns {Number} The generated OTP */
function generate_otp() {
  let digits = '0123456789';
  let otp = '';
  let len = digits.length
  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * len)];
  }
  return otp;
}

/**
 * Create, set and send the OTP code
 * @param {string} email 
 * @returns {APIReturn} */
export async function create_user_otp(email){
  const otp = generate_otp();
  log.info(`Generated OTP Code ${otp}`);

  let d = new Date();
  let date = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDay()} `
  let time = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
  const todays_date = date + time
  const sql_values = {
    table: "user_sign_in_requests",
    columns: "request_time, sign_in_type, request_provider, request_value, user_attribute, sign_in_complete",
    values: `'${todays_date}', 'otp', 'otp', '${otp}', '${email}', false`
  }

  const sql_return = await sql_insert(sql_values);
  let unique_id;
  if (sql_return.error){
    return sql_return;
  } else {
    unique_id = sql_return.data[0].insertId;
  }
  log.info("OTP Added to Database")
  const auth_email_sent = await send_user_code(email, otp);
  
  if (auth_email_sent.data){
    return {
      error: false, 
      data: {unique_id: unique_id}
    };
  } else{
    return auth_email_sent;
  }
};

/**
 * Checks the given OTP against the saved OTP
 * @param {string} uid 
 * @param {string} code 
 * @returns {APIReturn}
 */
export function check_otp(uid, code){
  const sql_query = {
    select: "request_value",
    from: "user_sign_in_requests",
    where: `request_id = ${uid}`
  }
  const sql_return = sql_select(sql_query);
  if(sql_return.error){
    return sql_return;
  } else {
    const saved_code = sql_return.data.result;
    if(saved_code == code){
      return {error: false, data: {code_match: true}}
    } else{
      return {
        error: {
          code: "code_mismatch", 
          message: "The code entered by the user is not correct"
        }, 
        data: false
      }
    }
  }
}