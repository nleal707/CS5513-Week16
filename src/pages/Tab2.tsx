// Import camera and images icons
import { camera, images } from 'ionicons/icons';
// CHANGE: Update import
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonToast,
  IonSpinner,
  IonText,
} from '@ionic/react';
import React, { useState } from 'react';
// Add `usePhotoGallery` import
import { usePhotoGallery, UserPhoto } from '../hooks/usePhotoGallery';
import PhotoDetailModal from '../components/PhotoDetailModal';
import './Tab2.css';

const Tab2: React.FC = () => {
  // Add `photos` array to destructure from `usePhotoGallery()`
  const { photos, addNewToGallery, selectFromGallery, deletePhoto, sharePhoto } = usePhotoGallery();
  
  const [selectedPhoto, setSelectedPhoto] = useState<UserPhoto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');
  const [showToast, setShowToast] = useState(false);

  const showError = (message: string) => {
    setToastMessage(message);
    setToastColor('danger');
    setShowToast(true);
  };

  const showSuccess = (message: string) => {
    setToastMessage(message);
    setToastColor('success');
    setShowToast(true);
  };

  const handlePhotoClick = (photo: UserPhoto) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

  const handleAddPhoto = async () => {
    try {
      setIsLoading(true);
      await addNewToGallery();
      showSuccess('Photo added successfully!');
    } catch (error) {
      console.error('Error adding photo:', error);
      showError('Failed to add photo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFromGallery = async () => {
    try {
      setIsLoading(true);
      await selectFromGallery();
      showSuccess('Photo added from gallery!');
    } catch (error) {
      console.error('Error selecting from gallery:', error);
      showError('Failed to select photo from gallery.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (photo: UserPhoto) => {
    try {
      await sharePhoto(photo);
      showSuccess('Photo shared successfully!');
    } catch (error) {
      console.error('Error sharing photo:', error);
      showError('Failed to share photo.');
      throw error;
    }
  };

  const handleDelete = async (filepath: string) => {
    try {
      await deletePhoto(filepath);
      showSuccess('Photo deleted successfully!');
    } catch (error) {
      console.error('Error deleting photo:', error);
      showError('Failed to delete photo.');
      throw error;
    }
  };

  const EmptyState: React.FC = () => (
    <div className="empty-state" role="status" aria-live="polite">
      <IonIcon icon={camera} className="empty-state-icon" aria-hidden="true" />
      <IonText>
        <h2>No photos yet</h2>
        <p>Tap the camera button to take your first photo!</p>
      </IonText>
    </div>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Photo Gallery</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Photo Gallery</IonTitle>
          </IonToolbar>
        </IonHeader>

        {isLoading && (
          <div className="loading-overlay" role="status" aria-live="polite" aria-label="Loading">
            <IonSpinner name="crescent" />
            <span className="sr-only">Loading photos</span>
          </div>
        )}

        {photos.length === 0 ? (
          <EmptyState />
        ) : (
          <IonGrid>
            <IonRow>
              {photos.map((photo) => (
                <IonCol size="6" key={photo.filepath}>
                  <div
                    className="photo-thumbnail"
                    onClick={() => handlePhotoClick(photo)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View photo ${photos.indexOf(photo) + 1} of ${photos.length}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handlePhotoClick(photo);
                      }
                    }}
                  >
                    <IonImg src={photo.webviewPath} alt={`Photo ${photos.indexOf(photo) + 1}`} />
                  </div>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        )}

        {/* Floating action buttons */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton 
            onClick={handleSelectFromGallery} 
            disabled={isLoading}
            aria-label="Select photo from gallery"
          >
            <IonIcon icon={images} aria-hidden="true"></IonIcon>
          </IonFabButton>
        </IonFab>
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton 
            onClick={handleAddPhoto} 
            disabled={isLoading}
            aria-label="Take a new photo"
          >
            <IonIcon icon={camera} aria-hidden="true"></IonIcon>
          </IonFabButton>
        </IonFab>

        <PhotoDetailModal
          isOpen={isModalOpen}
          photo={selectedPhoto}
          onClose={handleCloseModal}
          onShare={handleShare}
          onDelete={handleDelete}
        />

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          color={toastColor}
          position="top"
          aria-live={toastColor === 'danger' ? 'assertive' : 'polite'}
        />
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
