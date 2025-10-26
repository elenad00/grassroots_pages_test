import {
  ArtistCarousel, 
  NavButton, 
  PageContent, 
  PageElement, 
  VenueCarousel 
} from "../components/multiuse-elements";
import data from "../page-content/homepage.json";

export default function Homepage (){
  const carousels = [false, VenueCarousel, ArtistCarousel, false]
  const missionBlocks = (
    Object.entries(data.our_mission.blocks).map(([k,v], i) => 
      <div key={i}>
        <h3>{`For ${k}`}</h3>
        <p>{v}</p>
      </div>
    )
  )
  return (
    <PageContent>
      {Object.entries(data).map(([k,v], i) => (
        <PageElement title={v.header} key={i}>
          { carousels[i] }
          { v.button && <NavButton content={v.button} /> }
          { i==3 && missionBlocks}
        </PageElement>
      ))}
    </PageContent>
  )
}
