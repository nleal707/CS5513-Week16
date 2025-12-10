import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonImg,
  IonLabel,
  IonItem,
  IonText
} from '@ionic/react';
import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { arrowBack } from 'ionicons/icons';
import { sanitizeHTML, decodeHTMLEntities } from '../utils/htmlUtils';
import './PlaceDetail.css';

interface Place {
  ID: number;
  post_title: string;
  preview_title: string;
  preview_description: string;
  preview_image: string;
  featured_image_title: string;
  featured_image_description: string;
  featured_image: string;
  section_1_title: string;
  section_1_description: string;
  section_1_image: string;
  section_2_title: string;
  section_2_description: string;
  section_2_image: string;
  section_3_title: string;
  section_3_description: string;
  section_3_image: string;
  section_4_title: string;
  section_4_description: string;
  section_4_image: string;
  section_5_title: string;
  section_5_description: string;
  section_5_image: string;
  secondary_image_title: string;
  secondary_image_description: string;
  secondary_image: string;
}

interface LocationState {
  place?: Place;
}

const PlaceDetail: React.FC = () => {
  const location = useLocation<LocationState>();
  const history = useHistory();
  const place = location.state?.place;

  // If no place data, redirect back to places list
  // Only redirect if we're on the place route without data (not when navigating to other tabs)
  useEffect(() => {
    if (!place && location.pathname === '/place') {
      history.replace('/tab3');
    }
  }, [place, location.pathname, history]);

  // Handler for back button navigation - ensures reliable navigation to Tab3
  const handleBackClick = () => {
    // Use replace to maintain tab context and prevent history stack issues
    history.replace('/tab3');
  };

  // If no place data, show nothing while redirecting
  if (!place) {
    return null;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={handleBackClick}>
              <IonIcon slot="icon-only" icon={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>Places</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{decodeHTMLEntities(place.post_title)}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>{decodeHTMLEntities(place.preview_title)}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {place.featured_image && (
              <>
                <IonImg src={place.featured_image} alt={decodeHTMLEntities(place.post_title)} />
                {place.featured_image_description && (
                  <IonText>
                    <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(place.featured_image_description) }} />
                  </IonText>
                )}
              </>
            )}
          </IonCardContent>
        </IonCard>

        {place.section_1_title && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{decodeHTMLEntities(place.section_1_title)}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(place.section_1_description) }} />
              </IonText>
            </IonCardContent>
          </IonCard>
        )}

        {place.section_2_title && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{decodeHTMLEntities(place.section_2_title)}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(place.section_2_description) }} />
              </IonText>
            </IonCardContent>
          </IonCard>
        )}

        {place.section_3_title && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{decodeHTMLEntities(place.section_3_title)}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(place.section_3_description) }} />
              </IonText>
            </IonCardContent>
          </IonCard>
        )}

        {place.section_4_title && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{decodeHTMLEntities(place.section_4_title)}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(place.section_4_description) }} />
              </IonText>
            </IonCardContent>
          </IonCard>
        )}

        {place.section_5_title && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{decodeHTMLEntities(place.section_5_title)}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(place.section_5_description) }} />
              </IonText>
            </IonCardContent>
          </IonCard>
        )}

        {place.secondary_image && (
          <IonCard>
            <IonCardContent>
              <IonImg src={place.secondary_image} alt={place.secondary_image_description || 'Secondary image'} />
              {place.secondary_image_description && (
                <IonText>
                  <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(place.secondary_image_description) }} />
                </IonText>
              )}
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default PlaceDetail;

