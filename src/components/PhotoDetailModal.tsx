import React from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonButtons,
  IonImg,
  IonText,
  IonAlert,
} from '@ionic/react';
import { close, shareOutline, trashOutline } from 'ionicons/icons';
import { UserPhoto } from '../hooks/usePhotoGallery';
import './PhotoDetailModal.css';

interface PhotoDetailModalProps {
  isOpen: boolean;
  photo: UserPhoto | null;
  onClose: () => void;
  onShare: (photo: UserPhoto) => Promise<void>;
  onDelete: (filepath: string) => Promise<void>;
}

const PhotoDetailModal: React.FC<PhotoDetailModalProps> = ({
  isOpen,
  photo,
  onClose,
  onShare,
  onDelete,
}) => {
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isSharing, setIsSharing] = React.useState(false);

  const handleShare = async () => {
    if (!photo) return;
    try {
      setIsSharing(true);
      await onShare(photo);
    } catch (error) {
      console.error('Failed to share photo:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!photo) return;
    try {
      setIsDeleting(true);
      await onDelete(photo.filepath);
      setShowDeleteAlert(false);
      onClose();
    } catch (error) {
      console.error('Failed to delete photo:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (timestamp?: number): string => {
    if (!timestamp) return 'Unknown date';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatSize = (bytes?: number): string => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (!photo) return null;

  return (
    <>
      <IonModal isOpen={isOpen} onDidDismiss={onClose} aria-labelledby="photo-modal-title">
        <IonHeader className="photo-modal-header">
          <IonToolbar>
            <IonTitle id="photo-modal-title">Photo Details</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={onClose} className="close-button" aria-label="Close photo details">
                <IonIcon icon={close} aria-hidden="true" />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="photo-detail-content">
          <div className="photo-detail-container">
            <IonImg
              src={photo.webviewPath}
              alt="Photo detail view"
              className="photo-detail-image"
            />
            <div className="photo-detail-metadata" id="photo-metadata" aria-label="Photo information">
              <IonText>
                <p className="metadata-item">
                  <strong>Date:</strong> {formatDate(photo.dateTaken)}
                </p>
                <p className="metadata-item">
                  <strong>Size:</strong> {formatSize(photo.size)}
                </p>
              </IonText>
            </div>
            <div className="photo-detail-actions">
              <IonButton
                expand="block"
                className="share-button"
                onClick={handleShare}
                disabled={isSharing}
                aria-label="Share photo"
                aria-describedby="photo-metadata"
              >
                <IonIcon icon={shareOutline} slot="start" aria-hidden="true" />
                {isSharing ? 'Sharing...' : 'Share'}
              </IonButton>
              <IonButton
                expand="block"
                className="delete-button"
                onClick={() => setShowDeleteAlert(true)}
                disabled={isDeleting}
                aria-label="Delete photo"
                aria-describedby="photo-metadata"
              >
                <IonIcon icon={trashOutline} slot="start" aria-hidden="true" />
                Delete
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={() => setShowDeleteAlert(false)}
        header="Delete Photo"
        message="Are you sure you want to delete this photo? This action cannot be undone."
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Delete',
            role: 'destructive',
            handler: handleDeleteConfirm,
          },
        ]}
      />
    </>
  );
};

export default PhotoDetailModal;

