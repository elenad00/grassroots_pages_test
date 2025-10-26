import { Icon } from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { NavButton } from "./multiuse-elements";
import styles from "../css/data-cards.module.css";
import venueData from "../page-content/venues.json";
import "./css/leaflet.css";

function VenueMarker ({venue}) {
  const iconConfig = {
    // Set the icon link, size, anchor point, and where the popup anchors from
    iconUrl: "../../public/images/marker-icon.png",
    iconSize: [30, 32],
    iconAnchor: [15, 32],
    popupAnchor:[0, 0]
  };
  // Create the venue marker icon that points to a venue on the map
  const buttonContent = {
    link:`/venues/${venue.username}`, 
    title: "Learn More"
  }
  return (
    <Marker icon={new Icon(iconConfig)} position={venue.coordinates}>
      <Popup className={styles.markerPopup}>
        <h4>{venue.name}</h4>
        {venue.address.map((line, i) => {
          return <p key={i}>{line}</p>
        })} 
        <NavButton content={buttonContent}/>
      </Popup>
    </Marker>
  );
} 

function VenueMap({center, zoom, venues}){
  // Returns a map containing markers to each of the affiliated Grassroots venues
  // The attribution for OpenStreetMaps
  const layerAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
  // The link to get the map image
  const layerURL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  // Create the markers for the venues
  
  const markers = [];
  for (const k in venues){
    const venueData = venues[k]
    venueData.username = k
    markers.push(<VenueMarker key={k} venue={venues[k]}/>)
  }
  return (
    <MapContainer center={center} zoom={zoom} worldCopyJump={false}>
      {/* Set the map's attribution as well as importing the map itself */}
      <TileLayer attribution={layerAttribution} url={layerURL}/>
      {/* for each venue in venues, return the marker and its popup */}
      {markers.map((marker) => {return marker})}
    </MapContainer>
  );
};

export function AllVenuesMap({}){
  return <VenueMap 
    center={[51.52, -.1]} 
    zoom={13} 
    venues={venueData} 
  />
}
export function SingleVenueMap({venue}){
  const [k, data] = Object.entries(venue)[0];
  return <VenueMap 
    center={data.coordinates} 
    zoom={16} 
    venues={venue}
  />
}