import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonList, 
  IonListHeader, 
  IonItem, 
  IonLabel,
  IonIcon
} from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { chevronForwardOutline } from 'ionicons/icons';
import { sanitizeHTML, truncateHTMLToWords, exceedsWordCount, removeHrefAttributes, decodeHTMLEntities } from '../utils/htmlUtils';
import './Tab1.css';

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


const Tab1: React.FC = () => {
  const history = useHistory();

  // dataset state variable to hold JSON data from WP REST API
  const [dataset, setDataset] = useState<Article[]>([]);

  // URL for WP REST API endpoint
  const dataURL = 'https://dev-nleal-cs5513.pantheonsite.io/wp-json/twentytwentyfive-child/v1/articles';
 //  const dataURL = 'http://localhost:8000/wp-json/wp/v2/articles';

  // useEffect to fetch data from WP REST API
  useEffect(() => {
    fetch(dataURL)
      .then(response => response.json())
      .then(data => setDataset(data));
  }, []);

  // Handler to navigate to article detail page
  const handleArticleClick = (article: Article) => {
    history.push('/article', { article });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Articles</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Articles</IonTitle>
          </IonToolbar>
        </IonHeader>
        {/* use map() to loop through JSON array returned from WP REST API */}
        <IonList id="article-list">
          {dataset.map((item, index) => (
            <IonItem lines="inset" key={index} button onClick={() => handleArticleClick(item)}>
              <IonLabel>
                <h4>{decodeHTMLEntities(item.preview_title)}</h4>
                <p style={{ display: 'inline-block' }}>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: (() => {
                        const description = item.preview_description || '';
                        // Remove href attributes first (prevents navigation conflicts)
                        const withoutHrefs = removeHrefAttributes(description);
                        // Then sanitize for security
                        const sanitized = sanitizeHTML(withoutHrefs);
                        // Finally truncate if needed
                        const needsTruncation = exceedsWordCount(sanitized, 40);
                        const truncated = needsTruncation 
                          ? truncateHTMLToWords(sanitized, 40) + '...' 
                          : sanitized;
                        return truncated;
                      })()
                    }}
                  />
                  {exceedsWordCount(item.section_1_description || '', 40) && (
                    <IonIcon 
                      icon={chevronForwardOutline} 
                      style={{ verticalAlign: 'middle', marginLeft: '4px', display: 'inline-block' }} 
                    />
                  )}
                </p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
