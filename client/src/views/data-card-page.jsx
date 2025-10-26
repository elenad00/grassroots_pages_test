import { AllVenuesMap } from "../components/venue-map";
import { ArtistCards, Loader, PageContent, PageElement, VenueCards } from "../components/multiuse-elements";
import styles from "../css/data-cards.module.css";
import { useEffect, useState } from "react";

export default function DataCardPage() {
  const [isLoading, setIsLoading] = useState(true)
	const [cardData, setCardData] = useState();
	const [subTitle, setSubTitle] = useState({});
	const [venueMap, setVenueMap] = useState(false);

	const dataType = window.location.pathname.substring(1);

	useEffect(() => {
		if (dataType == "venues") {
			setSubTitle("venue-list");
			setCardData(VenueCards);
			setVenueMap((
        <PageElement subclass={styles.allVenuesMap}>
          <AllVenuesMap />
        </PageElement>
      ));
		} else {
			setCardData(ArtistCards);
		}
    setIsLoading(false)
	}, []);

  if(isLoading){return Loader}
  else{
    return (
      <PageContent page={dataType}>
        {venueMap}
        <PageElement title={subTitle}>
          <div className={styles.cardHolder}>
            {cardData.map((card) => card)}
          </div>
        </PageElement>
      </PageContent>
    )
  }
}
