import artistData from "../page-content/artists.json";
import { Link } from "react-router";
import pageData from "../page-content/page-headers.json";
import { ScaleLoader } from "react-spinners";
import styles from "./css/multiuse.module.css";
import venueData from "../page-content/venues.json";
import "../functionality/types"

/** Creates a navigation button that will take the user to another page
 * @param {Object} parameters The parameters parsed to the item
 * @param {ButtonContent} parameters.content The button's content
 * @returns {React.ReactElement} The navigation button
 */
export function NavButton ({content}){
  return (
    <button className={styles.navButton}>
      <Link to={content.link}> 
        {content.title}
      </Link>
    </button>
  )
};
/** Creates the heading for the page or page element
 * @param {Object} parameters The parameters parsed to the item
 * @param {(HeaderContent | string)} parameters.page The page's title
 * @returns {React.ReactElement} The page header element
 */
function PageHeader({page}){
  /** @type {HeaderContent} */
  const headingItems = (
    typeof page == "string" 
    ? pageData[page]
    : page
  )
  return (
    <div className={styles.header}>
      <h1>{headingItems.heading}</h1>
      <h5>{headingItems.subheading}</h5>
    </div>
  )
}
/** Creates a div object that holds the page's content
 * @param {Object} parameters The parameters parsed to the item
 * @param {(HeaderContent | string | false)} parameters.page The page's title
 * @param {React.ReactElement} parameters.children The items that are contained within the page content
 * @returns {React.ReactElement} A div that holds the main page content
 */
export function PageContent({page, children}){
  return (
    <div className={styles.pageContent}>
      {page && <PageHeader page={page} />}
      {children}
    </div>
  )
}
/** Creates a div object that holds the page's content
 * @param {Object} parameters The parameters parsed to the item
 * @param {(HeaderContent | string | false)} parameters.title The page's title
 * @param {string} parameters.display The flex direction of the element
 * @param {React.ReactElement} parameters.children The items that are contained within the page content
 * @param {any} parameters.subclass The secondary style to be applied to the element
 * @returns {React.ReactElement} A div that holds a page element
 */
export function PageElement({title, display, children, subclass}){
  let style = `${styles.pageElement}`
  style += display ? ` ${styles.pageElementRow}` : '';
  style+= subclass ? ` ${subclass}` : ''
  return (
    <div className={style}>
      {title && <PageHeader page={title} />}
      {children}
    </div>
  )
}
/** Creates a card containing the data about a artist/venue
 * @param {object} parameters
 * @param {string} parameters.username The artist/venue username
 * @param {DataItem} parameter.date The artist/venue data 
 * @returns {React.ReactElement} The populated data card */
function DataCard({username, data}){
  const buttonContent = {
    link: username, 
    title: "Learn More"
  }
  return(
    <div className={styles.dataCard}>
      <img src={data.imagePath} />
      <h2>{data.name}</h2>
      <p>{data.bio}</p>
      <NavButton content={buttonContent} />
    </div>
  )
}
/** Returns a card pack of all the artists/venues
 * @param {DataItem[]} pageData The pageData to pull the card elements from
 * @returns {React.ReactElement[]} The content for the pageData cards */
function GenerateCards(pageData){
  return Object.entries(pageData).map(([k, v]) => (
    <DataCard username={k} data={v} key={k}/>
  ));
}
export const ArtistCards = GenerateCards(artistData);
export const VenueCards = GenerateCards(venueData);

/** Creates an image carousel for the given pageData
 * @param {object} parameters the function's parameters
 * @param {DataItem[]} parameters.pageData The artist/venue pageData
 * @param {string} parameters.dataType The pageData type (artist/venue)
 * @returns {React.ReactElement} The image carousel element
 */
export function ImageCarousel({pageData, dataType}){
  return (
    <div className={styles.carousel}>
      {Object.entries(pageData).map(([k, v], i) => (
        <a href={`/${dataType}/${k}`} className={styles.carouselItem} key={i}>
          <img src={v.imagePath} />
          <h3>{v.name}</h3>
        </a>
      ))}
    </div>
  );
}
export const ArtistCarousel = <ImageCarousel pageData={artistData} dataType='artists' />;
export const VenueCarousel = <ImageCarousel pageData={venueData} dataType='venues' />;

/** A loading element to indicate that the page content is loading */
export const Loader = (
  <PageElement>
    <ScaleLoader width={5} height={80} color="#000000ff" barCount={10}/>
  </PageElement>
)