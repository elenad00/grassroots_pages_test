import artistData from "../page-content/artists.json";
import { FaInstagram } from "react-icons/fa";
import { ImageCarousel, Loader, PageContent, PageElement } from "../components/multiuse-elements";
import { SingleVenueMap } from "../components/venue-map";
import styles from "../css/single-value-page.module.css";
import { useEffect, useState } from "react";
import venueData from "../page-content/venues.json";

/** Returns a single value page, eg a page dedicated to a single artist or venue
 * @returns {React.ReactElement} */
export default function SingleValuePage () {
  const [data, setData] = useState();
  const [pageType, setPageType] = useState();
  const [pageHeading, setPageHeading] = useState("")
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('')
  
  useEffect(()=>{
    const [_, type, item] = window.location.pathname.split('/');
    const pageData = type == 'artists' ? artistData[item] : venueData[item];
    setPageType(type);
    setPageHeading(pageData.name)
    setData(pageData);
    setUsername(item)
    setIsLoading(false);
  }, [])

  function About(){
    return (
      <PageElement subclass={styles.about}>
        <img src={data.imagePath} />
        <PageElement title={{heading: `About ${data.name}`}}>
          <p>{data.bio}</p>
          {data.instagramHandle && 
            <a href={`https://instagram.com/${data.instagramHandle}`}><FaInstagram /></a>
          }
        </PageElement>
      </PageElement>
    )
  }

  function Shows(){
    let upcomingData;
    if (data.showList){
      upcomingData = <ImageCarousel data={data.showList} dataType={pageType} />
    } else{
      upcomingData = <h4> Looks like there's no upcoming shows! </h4>
    }
    return(
      <PageElement subclass={styles.shows} title={{heading: "Our Upcoming Shows"}}>
        {upcomingData}
      </PageElement>
    )
  }

  function VenueLocation(){
    const venueData = {};
    venueData[username] = data;
    return(
      <PageElement subclass={styles.location} title={{"heading":"Find Us"}}>
        <PageElement subclass={styles.mapHolder}>
          <SingleVenueMap venue={venueData}/>
        </PageElement>
      </PageElement>
    )
  }

  const PageElements = (
    <PageElement className={styles.venuePage}>
      <About />
      <PageElement>
        <Shows />
        {pageType=='venues' && <VenueLocation />}
      </PageElement>
    </PageElement>
  )
  
  return(
    <PageContent page={{heading:pageHeading}}>
      {isLoading
        ? Loader 
        : PageElements}
    </PageContent>
  )
};