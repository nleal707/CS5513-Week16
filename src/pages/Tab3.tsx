import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonImg,
  IonLabel,
  IonIcon,
  IonText,
  IonBadge
} from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { chevronForwardOutline, locationOutline } from 'ionicons/icons';
import { decodeHTMLEntities, processPreviewDescription, PREVIEW_WORD_LIMIT } from '../utils/htmlUtils';
import './Tab3.css';

interface Place {
  ID: number;
  post_title: string;
  preview_title: string;
  preview_description: string;
  preview_image: string;
  preview_image_url: string;
  featured_image_title: string;
  featured_image_description: string;
  featured_image: string;
  featured_image_url: string;
  section_1_title: string;
  section_1_description: string;
  section_1_image: string;
  section_1_url: string;
  section_1_address: string;
  section_1_cuisine: string;
  section_1_vibe: string;
  section_2_title: string;
  section_2_description: string;
  section_2_image: string;
  section_2_url: string;
  section_2_address: string;
  section_2_cuisine: string;
  section_2_vibe: string;
  section_3_title: string;
  section_3_description: string;
  section_3_image: string;
  section_3_url: string;
  section_3_address: string;
  section_3_cuisine: string;
  section_3_vibe: string;
  section_4_title: string;
  section_4_description: string;
  section_4_image: string;
  section_4_url: string;
  section_4_address: string;
  section_4_cuisine: string;
  section_4_vibe: string;
  section_5_title: string;
  section_5_description: string;
  section_5_image: string;
  section_5_url: string;
  section_5_address: string;
  section_5_cuisine: string;
  section_5_vibe: string;
  secondary_image_title: string;
  secondary_image_description: string;
  secondary_image: string;
  secondary_image_url: string;
}


const Tab3: React.FC = () => {
  const history = useHistory();

  // dataset state variable to hold JSON data from WP REST API
  const [dataset, setDataset] = useState<Place[]>([]);

  // URL for WP REST API endpoint
  const dataURL = 'https://dev-nleal-cs5513.pantheonsite.io/wp-json/twentytwentyfive-child/v1/places';
 //  const dataURL = 'http://localhost:8000/wp-json/wp/v2/articles';

  // useEffect to fetch data from WP REST API
  useEffect(() => {
    fetch(dataURL)
      .then(response => response.json())
      .then(data => setDataset(data));
  }, []);

  // Handler to navigate to place detail page
  const handlePlaceClick = (place: Place) => {
    history.push('/place', { place });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Places</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Places</IonTitle>
          </IonToolbar>
        </IonHeader>
        {/* use map() to loop through JSON array returned from WP REST API */}
        <div className="places-container animate-stagger">
          {dataset.map((item, index) => (
            <IonCard 
              key={index} 
              className="place-card"
              button 
              onClick={() => handlePlaceClick(item)}
              role="article"
              aria-label={`Place: ${decodeHTMLEntities(item.preview_title)}`}
            >
              {item.preview_image && (
                <IonImg 
                  src={item.preview_image} 
                  alt={decodeHTMLEntities(item.preview_title)}
                  className="place-card-image"
                />
              )}
              <IonCardHeader>
                <IonCardTitle>{decodeHTMLEntities(item.preview_title)}</IonCardTitle>
                <div className="place-location-indicator" aria-label="Location">
                  <IonIcon icon={locationOutline} className="location-icon" aria-hidden="true" />
                  <IonText className="location-text">Place</IonText>
                </div>
              </IonCardHeader>
              <IonCardContent>
                <IonText>
                  <p className="preview-description">
                    {(() => {
                      const { processedHTML, isTruncated } = processPreviewDescription(
                        item.preview_description,
                        PREVIEW_WORD_LIMIT
                      );
                      return (
                        <>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: processedHTML
                            }}
                          />
                          {isTruncated && (
                            <IonIcon 
                              icon={chevronForwardOutline} 
                              className="preview-chevron"
                              aria-hidden="true"
                            />
                          )}
                        </>
                      );
                    })()}
                  </p>
                </IonText>
              </IonCardContent>
            </IonCard>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;