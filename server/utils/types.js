/**
 * @typedef {Object} Error The error returned by the API
 * @prop {string} message The error message sent by the API
 * @prop {string} code The error code sent by the API
 */

/**
 * @typedef {Object} APIReturn
 * @prop {Error | false} error The error, if any, created by the process 
 * @prop {Data | false} data Data, if any, returned by the process
 */

/**
 * @typedef {Object} EmailReturn The content and metadata of the email being sent
 * @prop {string} to Who the email is sent to
 * @prop {string} from Who the email is from
 * @prop {string} subject The email's subject
 * @prop {string} body The email content
 */

/**
 * @typedef {Object} SQLSelect Selects data from the database
 * @prop {string} select The values to select
 * @prop {string} from The table to gt the data from
 * @prop {string} where The condition to be met to get data
 */

/**
 * @typedef {Object} SQLInsert Inserts data into the database
 * @prop {string} table The table to insert data into
 * @prop {string} columns The columns data is being inserted against
 * @prop {string} values The values being inserted
 */

/**
 * @typedef {Object} SQLUpdate Updates a row in a table
 * @prop {string} update  The name of the table 
 * @prop {string} set The column name and value to set it to
 * @prop {string} where The condition to be met to update the data
 */