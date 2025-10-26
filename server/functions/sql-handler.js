import constructLog from "../utils/logger.js";
import config from "../utils/config.js";
import mysql from "mysql2/promise";
import "../utils/types.js"

const log = constructLog("SQL Handler");

/** Runs the sql query
 * @param {string} query The SQL query to run
 * @returns {APIReturn} */
async function run_sql_query(query){
  const connection = mysql.createPool({
    host: config.sql.host,
    user: config.sql.user,
    password: config.sql.password,
    database: config.sql.database,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0
  });
  try{
    const sql_result = await connection.query(query);
    return {error: false, data: sql_result};
  } catch (err) {
    log.error("Error returned - ", err)
    return handle_sql_error(err)
  }
}

/** Handles errors returned by sql
 * @param {Object} error The error returned by the sql function
 * @returns {APIReturn} */
function handle_sql_error(error){
  log.error(`Error with SQL connection - ${error}`);
  const err = {
    code: error.code,
    message: error.message
  }
  return {error: err, data: false}
}

/** Inserts data into the database
 * @param {SQLInsert} values The values to populate the sql query with
 * @returns {APIReturn} */
export async function sql_insert(values){
  const query = `INSERT INTO ${values.table} (${values.columns}) VALUES (${values.values})`;
  const query_result = await run_sql_query(query);
  return query_result;
}

/** Selects data from the database
 * @param {SQLSelect} values The values to populate the sql query with
 * @returns {APIReturn} */
export function sql_select(values){
  const query = `SELECT ${values.select} FROM ${values.from} WHERE ${values.where};`;
  return run_sql_query(query);
}

/** Updates fields for a given row in the database
 * @param {SQLUpdate} values The values to populate the sql query with
 * @returns {APIReturn} */
export function sql_update(values){
  const query = `UPDATE ${values.table} SET ${values.set} WHERE ${values.where};`
  return run_sql_query(query);
}