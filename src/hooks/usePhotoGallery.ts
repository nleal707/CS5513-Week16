// Add import
import { useState, useEffect } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import type { Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { isPlatform } from '@ionic/react';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';

export function usePhotoGallery() {
    // Add the `photos` array
    const [photos, setPhotos] = useState<UserPhoto[]>([]);
    // Add a key for photo storage
    const PHOTO_STORAGE = 'photos';

    // Add useEffect hook
    useEffect(() => {
        // Add `loadSaved()` method
        const loadSaved = async () => {
            const { value: photoList } = await Preferences.get({ key: PHOTO_STORAGE });
            const photosInPreferences = (photoList ? JSON.parse(photoList) : []) as UserPhoto[];

            // CHANGE: Add platform check
            // If running on the web...
            if (!isPlatform('hybrid')) {
                for (const photo of photosInPreferences) {
                const readFile = await Filesystem.readFile({
                    path: photo.filepath,
                    directory: Directory.Data,
                });
                photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
                }
            }

            setPhotos(photosInPreferences);
        };

        loadSaved();
    }, []);
    
    const addNewToGallery = async (source: CameraSource = CameraSource.Camera) => {
    // Take a photo or select from gallery
    const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: source,
        quality: 100,
    });

  // Create the `fileName` with current timestamp
    const fileName = Date.now() + '.jpeg';
    // Add `savedImageFile`
    // Save the picture and add it to photo collection
    const savedImageFile = await savePicture(capturedPhoto, fileName);

    // Update state with new photo
    const newPhotos = [savedImageFile, ...photos];
    setPhotos(newPhotos);

    // Add method to cache all photo data for future retrieval
    Preferences.set({ key: PHOTO_STORAGE, value: JSON.stringify(newPhotos) });
  };

  const selectFromGallery = async () => {
    return addNewToGallery(CameraSource.Photos);
  };

  // Add the `savePicture()` method
  const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
  let base64Data: string | Blob;
  let fileSize: number = 0;
  // CHANGE: Add platform check
  // "hybrid" will detect mobile - iOS or Android
  if (isPlatform('hybrid')) {
    const readFile = await Filesystem.readFile({
      path: photo.path!,
    });
    base64Data = readFile.data;
    fileSize = (readFile.data as string).length;
  } else {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    base64Data = (await convertBlobToBase64(blob)) as string;
    fileSize = blob.size;
  }

  const savedFile = await Filesystem.writeFile({
    path: fileName,
    data: base64Data,
    directory: Directory.Data,
  });

  const now = Date.now();

  // CHANGE: Add platform check
  if (isPlatform('hybrid')) {
    // Display the new image by rewriting the 'file://' path to HTTP
    return {
      filepath: savedFile.uri,
      webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      dateTaken: now,
      size: fileSize,
    };
  } else {
    // Use webPath to display the new image instead of base64 since it's
    // already loaded into memory
    return {
      filepath: fileName,
      webviewPath: photo.webPath,
      dateTaken: now,
      size: fileSize,
    };
  }
};

  // CHANGE: Add `convertBlobToBase64()` method
  const convertBlobToBase64 = (blob: Blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  };

  const deletePhoto = async (filepath: string) => {
    try {
      // Extract filename from filepath (handle both URI and plain filename)
      let filename = filepath;
      if (isPlatform('hybrid') && filepath.includes('/')) {
        // Extract filename from URI path
        const parts = filepath.split('/');
        filename = parts[parts.length - 1];
      }

      // Remove from filesystem
      await Filesystem.deleteFile({
        path: filename,
        directory: Directory.Data,
      });

      // Update state
      const updatedPhotos = photos.filter((photo) => photo.filepath !== filepath);
      setPhotos(updatedPhotos);

      // Update Preferences storage
      Preferences.set({ key: PHOTO_STORAGE, value: JSON.stringify(updatedPhotos) });
    } catch (error) {
      console.error('Error deleting photo:', error);
      throw error;
    }
  };

  const sharePhoto = async (photo: UserPhoto) => {
    try {
      if (isPlatform('hybrid')) {
        // Use Capacitor Share API for native platforms
        if (photo.webviewPath) {
          await Share.share({
            title: 'Share Photo',
            text: 'Check out this photo!',
            url: photo.webviewPath,
            dialogTitle: 'Share Photo',
          });
        }
      } else {
        // Web fallback: use Web Share API or download
        if (navigator.share && photo.webviewPath) {
          try {
            // Convert data URL to blob for sharing
            const response = await fetch(photo.webviewPath);
            const blob = await response.blob();
            const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
            
            await navigator.share({
              title: 'Share Photo',
              text: 'Check out this photo!',
              files: [file],
            });
          } catch (shareError) {
            // Fallback to download if share fails
            const link = document.createElement('a');
            link.href = photo.webviewPath!;
            link.download = 'photo.jpg';
            link.click();
          }
        } else {
          // Fallback: download the photo
          const link = document.createElement('a');
          link.href = photo.webviewPath!;
          link.download = 'photo.jpg';
          link.click();
        }
      }
    } catch (error) {
      console.error('Error sharing photo:', error);
      throw error;
    }
  };

  return {
    addNewToGallery,
    selectFromGallery,
    deletePhoto,
    sharePhoto,
    // Update return statement to include `photos` array
    photos,
  };
}

// Add the `UserPhoto` interface
export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
  dateTaken?: number;
  size?: number;
}