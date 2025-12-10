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
import './ArticleDetail.css';

interface Article {
  ID: number;
  post_title: string;
  preview_title: string;
  preview_description: string;
  featured_image: string;
  featured_image_description: string;
  section_1_title: string;
  section_1_description: string;
  section_2_title: string;
  section_2_description: string;
  section_3_title: string;
  section_3_description: string;
  section_4_title: string;
  section_4_description: string;
  section_5_title: string;
  section_5_description: string;
  secondary_image: string;
  secondary_image_description: string;
}

interface LocationState {
  article?: Article;
}

const ArticleDetail: React.FC = () => {
  const location = useLocation<LocationState>();
  const history = useHistory();
  const article = location.state?.article;

  // If no article data, redirect back to articles list
  // Only redirect if we're on the article route without data (not when navigating to other tabs)
  useEffect(() => {
    if (!article && location.pathname === '/article') {
      history.replace('/tab1');
    }
  }, [article, location.pathname, history]);

  // Handler for back button navigation - ensures reliable navigation to Tab1
  const handleBackClick = () => {
    // Use replace to maintain tab context and prevent history stack issues
    history.replace('/tab1');
  };

  // If no article data, show nothing while redirecting
  if (!article) {
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
          <IonTitle>Articles</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{decodeHTMLEntities(article.post_title)}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>{decodeHTMLEntities(article.preview_title)}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {article.featured_image && (
              <>
                <IonImg src={article.featured_image} alt={decodeHTMLEntities(article.post_title)} />
                {article.featured_image_description && (
                  <IonText>
                    <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.featured_image_description) }} />
                  </IonText>
                )}
              </>
            )}
          </IonCardContent>
        </IonCard>

        {article.section_1_title && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{decodeHTMLEntities(article.section_1_title)}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.section_1_description) }} />
              </IonText>
            </IonCardContent>
          </IonCard>
        )}

        {article.section_2_title && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{decodeHTMLEntities(article.section_2_title)}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.section_2_description) }} />
              </IonText>
            </IonCardContent>
          </IonCard>
        )}

        {article.section_3_title && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{decodeHTMLEntities(article.section_3_title)}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.section_3_description) }} />
              </IonText>
            </IonCardContent>
          </IonCard>
        )}

        {article.section_4_title && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{decodeHTMLEntities(article.section_4_title)}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.section_4_description) }} />
              </IonText>
            </IonCardContent>
          </IonCard>
        )}

        {article.section_5_title && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{decodeHTMLEntities(article.section_5_title)}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.section_5_description) }} />
              </IonText>
            </IonCardContent>
          </IonCard>
        )}

        {article.secondary_image && (
          <IonCard>
            <IonCardContent>
              <IonImg src={article.secondary_image} alt={article.secondary_image_description || 'Secondary image'} />
              {article.secondary_image_description && (
                <IonText>
                  <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.secondary_image_description) }} />
                </IonText>
              )}
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ArticleDetail;

