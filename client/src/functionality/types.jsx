/** 
 * @typedef {Object} APIError The error returned by the API
 * @prop {string} message The error message sent by the API
 * @prop {string} code The error code sent by the API
 * @prop {int} status The HTTP code sent by the error
*/
/**
 * @typedef {Object} MinimalUserData The user data provided by the API
 * @prop {string} username The username of the user
 * @prop {boolean} firstSeen If this is the first time Descope has seen this account
*/
/**
 * @typedef {Object} JWTs The JWTs provided by the API
 * @prop {string} session The session token supplied by the API
 * @prop {string} refresh The refresh token supplied by the API
*/
/**
 * @typedef {Object} APIData The data returned by the API
 * @prop {string} url The redirect URL sent by the API
 * @prop {JWTs} jwts The JWTs supplied by the API
 * @prop {MinimalUserData} userData The user data supplied by the API
*/
/** 
* @typedef {Object} APIResponse the error and data returned from the api
* @prop {APIError | false} error The error returned from the API
* @prop {APIData | false} data The data returned from the API
*/
/**
 * @typedef {Object} EmailFormData The contents of the email sign in
 * @prop {string} userEmail The email address the user provided
*/
/**
 * @typedef {Object} ButtonContent The content of the navigation button
 * @prop {string} link The link the user will be taken to 
 * @prop {string} title The button's title
*/
/**
 * @typedef {Object} HeaderContent The content of the navigation button
 * @prop {string} heading The main heading
 * @prop {string} subheading The subheading
*/
/**
 * @typedef {Object} DataItem The page content for either a venue or artist
 * @prop {string} name The artist/venue name
 * @prop {string} bio The artist/venue bio
 * @prop {string} imagePath The path to the artist/venue image
 * @prop {string} instagramHandle The artist/venue's Instagram handle
 * @prop {string[] | false} address The venue's address
 * @prop {string[] | false} artistLineup The upcoming performances for the venue
 * @prop {int[] | false} coordinates The venue's coordinates
 */
/**
 * @typedef {Object} FullUserData The user's data
 * @prop {string} username The user's username
 * @prop {string} email The user's email
 * @prop {string} picture A url to the user's picture
 * @prop {string} forename The user's forename
 * @prop {string} surname The user's surname
 * @prop {string[]} favArtists The user's favourite artists
 * @prop {string[]} favVenues The user's favourite venues
 */