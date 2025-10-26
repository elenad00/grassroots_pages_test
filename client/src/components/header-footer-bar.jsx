import { FaInstagram } from 'react-icons/fa';
import { GetUsername, TouchJWT } from "../functionality/session-storage";
import { PiMicrophoneStageBold } from "react-icons/pi";
import styles from "./css/header-footer.module.css";
import { useEffect, useState } from "react";

export function HeaderBar () {
  const [dropdownStyle, setDropdownStyle] = useState(styles.dropdownList);
  const [subStyle, setSubstyle] = useState("");
  const [dropdownLinks, setDropdownLinks] = useState(
    <div><li><a href='/sign-in'>sign in</a></li></div>
  )
  window.addEventListener("scroll", scrollFunction);

  function scrollFunction(){
    if (this.scrollY>=50){
      setSubstyle(styles.userScrolled)
    } else if (this.scrollY<49){
      setSubstyle("")
    }
  }

  useEffect(() => {
    const jwt = TouchJWT()
    if(jwt){
      const username = GetUsername() || 'grassroots user'
      setDropdownLinks((
        <div>
          <li key={0}><a href='/user/profile'>{username}</a></li>
          <li key={1}><a href='/user/settings'>user settings</a></li>
          <li key={2}><a href='/sign-out'>sign out</a></li>
        </div>
      ))
    }
  }, [])

  return(
    <nav className={`${styles.headerBar} ${subStyle}`}>
      <a href='/' className={styles.branding}>grassroots</a>
      <a className={styles.venues} href="/venues">our venues</a>
      <a className={styles.artists}  href="/artists">our artists</a>
      <button 
        onClick={()=>setDropdownStyle(styles.dropdownList)} 
        className={styles.micIcon}
      >
        <PiMicrophoneStageBold />
      </button>
      <div className={`${dropdownStyle} ${subStyle}`}>
        {dropdownLinks}
      </div>     
    </nav>
  )
};

export function FooterBar () {
  const instagramLink = "https://instagram.com/grassroots.ldn";
  const instagramIcon = (
    <a className={styles.instaIcon} href={instagramLink}>
      <FaInstagram/>
    </a>
  )
  return (
    <div className={styles.footerBar}>
      <h1>grassroots</h1>
      <p>Uniting grassroots venues, artists and fans across London</p>
      <div className={styles.contactLine}>
        {instagramIcon}
        <p>| hello@grassroots-london.com</p>
      </div>
    </div>
  )
}
