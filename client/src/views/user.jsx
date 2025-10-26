import artistData from "../page-content/artists.json"
import { GetFullUserInformation } from '../functionality/api';
import { NavButton, PageContent, PageElement } from "../components/multiuse-elements";
import styles from "../css/user-pages.module.css";
import multiuseStyles from "../components/css/multiuse.module.css"
import { TouchJWT } from "../functionality/session-storage"
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import venueData from "../page-content/venues.json";
import "../functionality/types";

/** Return an a array of the user's favourite artists/venues
 * @param {string[]} userFavs A username array of the user's favourite artists/venues
 * @param {DataItem} data The dataset tot use to get the favourites
 * @returns {Array} A mapping of the favourites */
function MapFavourites(userFavs, data){
  return userFavs.map((username) => {
    const item = data[username]
    return(
      <div className={styles.userFavourite}>
        <img src={item.imagePath}></img>
        <p>{item.name}</p>
      </div>
    )
  })
}
/** Returns the user's favourite artists/venues or message
 * @param {object} parameters The function's parameters
 * @param {string[]} parameters.userFavs An array of the user's favourite artists/venues
 * @param {DataItem[]} parameters.data The data item to use to get the favourites
 * @param {string} parameters.dataType The type of favourites (artists/venues)
 * @returns {React.ReactElement} */
function FavouritesContainer({userFavs, data, dataType}){
  const lowerType = dataType.toLowerCase();
  const favouritesDisplay = (
    userFavs 
    ? MapFavourites(userFavs.slice(0, 3), data, dataType) 
    : <p>Looks like you don't have any favourite {lowerType} yet</p>
  )
  const buttonContent = (
    userFavs
    ? {link:`/user/favourite-${lowerType}`, title: "View All"}
    : {link:`/${lowerType}`, title: "Go Find Some"}
  )
  return(
    <PageElement 
      title={{heading:`Your Favourite ${dataType}`}} 
      subclass={styles.favContainer}
    >
      {favouritesDisplay}
      <NavButton content={buttonContent} />
    </PageElement>
  )
}
/** Render the user's favourite artists/venues
 * @param {object} parameters Function parameters 
 * @param {string[]} parameters.userFavs The user's favourite artists/venues
 * @param {DataItem[]} parameters.data The data to use to generate the favourites
 * @returns {React.ReactElement} Returns user favourites page
 */
function Favourites({userFavs, data}){
  return(
    <PageElement display="row" subclass={styles.profileElementContainer}>
      {userFavs && MapFavourites(userFavs, data) }
      <p> We're still working on adding favourites - check back soon!</p>
    </PageElement>
  )
};

/** Render the user's settings
 * @param {Object} parameters 
 * @param {(FullUserData)} parameters.userData The user's data
 * @returns {React.ReactElement} Returns user's settings page */
function Settings ({userData}) {
  function handleForm(){console.log("Form Submitted")};
  const settingItems = {
    Picture: {
      currentContent: (
        userData.picture 
        ? <img src={userData.picture}></img> 
        : <p> Looks like you don't have a photo yet! </p>
      ),
      button: true
    },
    Username:{
      currentContent: (
        userData.username == "" 
        ? <p>Looks like you don't have a username yet!</p>
        : <p>Current Username: {userData.username}</p>
      ),
      key:'newUsername',
      input: true
    },
    Email:{
      currentContent: <p>Current Email: {userData.email}</p>,
      key:'newEmail',
      input: true
    }
  }
  function GenerateSettingsItem(type, data){
    return(
      <PageElement 
        title={{heading:`Update ${type}`}} 
        subclass={`${multiuseStyles.dataCard} ${styles.settingsItem}`}
      >
        {data.currentContent}
        {data.input && <input key={data.key} />}
        {data.button && (
          <>
            <button className={`${multiuseStyles.navButton} ${styles.uploadImageButton}`} disabled>
              Upload New Photo
            </button>
            <p className={styles.elementNotEnabled}>
              This functionality isn't available yet!
            </p>
          </>
        )}
      </PageElement>
    )
  }
  return (
    <PageElement subclass={styles.profileElementContainer}>
      <form onSubmit={handleForm} className={styles.userSettings}>
        <PageElement subclass={styles.settingsHolder}>
          {Object.entries(settingItems).map(([type, data]) => (
            GenerateSettingsItem(type, data)
          ))}
        </PageElement>
        <button className={multiuseStyles.navButton} type="submit" disabled>Update</button>
      </form>
      <p> You can't update your settings just yet - but here's what it will look like! </p>
    </PageElement>
  )
};

/** Render the user's profile
 * @param {Object} parameters 
 * @param {(FullUserData)} parameters.userData The user's data
 * @returns {React.ReactElement} The user's profile */
function Profile ({userData}){
  return(
    <PageElement display='row' subclass={styles.profileElementContainer}>
      <PageElement subclass={styles.userInfo}>
        {userData.picture ? <img src={userData.picture} />:<div/> }
        {userData.username ? <h2>{userData.username}</h2>:<h4>Username Not Set!</h4> }
        <p>{`${userData.forename} ${userData.surname}`}</p>
        <p>{userData.email}</p>
        <NavButton content={{link: "/user/settings", title: "Edit Profile"}} />
      </PageElement>
      <PageElement subclass={styles.userFavourites}>
        <FavouritesContainer userFavs={userData.favArtists} dataType="Artists" data={artistData} />
        <FavouritesContainer userFavs={userData.favVenues} dataType="Venues" data={venueData}/>
      </PageElement>
    </PageElement>
  )
};

export default function UserPage (){
  const [pageHeading, setPageHeading] = useState();
  const [pageValues, setPageValues] = useState();
  const requestedPage = useParams();
  /** Handles any errors that have occurred when attempting to render the page
   * @param {string} subheading 
   * @param {APIError | false} error */
  function handleError(subheading, error){
    if(!error){
      error = {status: 404, code: "USER_NOT_LOGGED_IN", message: "User Not Logged In"}
    }
    setPageHeading({heading: "Oops!", subheading: subheading});
    setPageValues(
    <PageElement>
      <NavButton content={{link:'/sign-in', title:"Sign In"}} />
    </PageElement>)
    console.log(`${error.status} ${error.code}: ${error.message}`)
  }
  /** Get the user's data and then render the page they have requested, otherwise render an error message */
  async function renderPage(){
    const resp = await GetFullUserInformation();
    const {error, data} = resp;
    if(error){
      handleError("We couldn't get your user data! Try again soon!", error);
      return
    }
    const content = {
      profile: {
        content: <Profile userData={data} />, 
        heading: 'Welcome Back!'
      },
      settings: {
        content: <Settings userData={data} />, 
        heading: 'User Settings'
      },
      "favourite-artists": {
        content: <Favourites userFavs={data.favArtists} data={artistData} />, 
        heading: "Your Favourite Artists"
      },
      "favourite-venues": {
        content: <Favourites userFavs={data.favVenues} data={venueData} />, 
        heading: "Your Favourite Venues"
      }
    }
    const getPage = requestedPage.subPage;
    if(!Object.keys(content).includes(getPage)){
      handleError(
        "Looks like that page doesn't exist!", 
        {value: 401, code: "PAGE_UNKNOWN", message: `Page ${requestedPage} does not exist`})
    } else {
      const pageData = content[getPage];
      setPageHeading({heading: pageData.heading});
      setPageValues(pageData.content);
    }
  }
  // When the parameters have been retrieved, go about rendering the page
  // this allows the page to rerender if they go from, say, profile to settings
  useEffect(()=>{
    TouchJWT()
    ? renderPage()
    : handleError("Looks like you're not logged in", false)
  },[requestedPage])

  return(
    <PageContent page={pageHeading}>
      {pageValues}
    </PageContent>
  )
};