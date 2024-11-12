import { Filesystem, Directory } from '@capacitor/filesystem';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

interface ImageFile {
  name: string;
  path: string;
  data: string;
}

export class ImageHandler {
  // Platform-specific paths
  private readonly ANDROID_DCIM_PATH = 'DCIM/Camera';
  private readonly IOS_DCIM_PATH = 'DCIM';
  
  /**
   * Get the correct DCIM path based on platform
   */
  private get DCIM_PATH(): string {
    return Capacitor.getPlatform() === 'android' 
      ? this.ANDROID_DCIM_PATH 
      : this.IOS_DCIM_PATH;
  }

  /**
   * Load all images from the platform-specific DCIM directory
   */
  async loadImagesFromDCIM(): Promise<ImageFile[]> {
    try {
      const result = await Filesystem.readdir({
        path: this.DCIM_PATH,
        directory: Directory.External
      });

      const images: ImageFile[] = [];
      
      for (const file of result.files) {
        if (this.isImageFile(file.name)) {
          const fileContent = await Filesystem.readFile({
            path: `${this.DCIM_PATH}/${file.name}`,
            directory: Directory.External
          });

          images.push({
            name: file.name,
            path: `${this.DCIM_PATH}/${file.name}`,
            data: fileContent.data as string
          });
        }
      }

      return images;
    } catch (error) {
      console.error('Error loading images:', error);
      throw error;
    }
  }

  /**
   * Create a new folder at the same level as the Camera folder (for Android)
   * or DCIM folder (for iOS)
   */
  async createFolder(folderName: string): Promise<void> {
    try {
      const basePath = Capacitor.getPlatform() === 'android'
        ? 'DCIM' // Create folder at DCIM level on Android
        : this.DCIM_PATH;

      await Filesystem.mkdir({
        path: `${basePath}/${folderName}`,
        directory: Directory.External,
        recursive: true
      });
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  }

  /**
   * Move an image to a specific folder
   */
  async moveImageToFolder(imagePath: string, folderName: string): Promise<void> {
    try {
      const fileName = imagePath.split('/').pop();
      if (!fileName) throw new Error('Invalid image path');

      const basePath = Capacitor.getPlatform() === 'android'
        ? 'DCIM' // Move to DCIM level on Android
        : this.DCIM_PATH;

      await Filesystem.rename({
        from: imagePath,
        to: `${basePath}/${folderName}/${fileName}`,
        directory: Directory.External
      });
    } catch (error) {
      console.error('Error moving image:', error);
      throw error;
    }
  }

  /**
   * Take a new photo and save it to a specific folder
   */
  async takePhotoAndSave(folderName: string): Promise<ImageFile> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });

      if (!image.path) throw new Error('No image path returned');

      const fileName = `IMG_${new Date().getTime()}.${image.format}`;
      const basePath = Capacitor.getPlatform() === 'android'
        ? 'DCIM' // Save to DCIM level on Android
        : this.DCIM_PATH;

      const savedImage = await Filesystem.writeFile({
        path: `${basePath}/${folderName}/${fileName}`,
        data: image.webPath!,
        directory: Directory.External
      });

      return {
        name: fileName,
        path: `${basePath}/${folderName}/${fileName}`,
        data: image.webPath!
      };
    } catch (error) {
      console.error('Error taking and saving photo:', error);
      throw error;
    }
  }

  /**
   * Check if a file is an image based on its extension
   */
  private isImageFile(fileName: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => 
      fileName.toLowerCase().endsWith(ext)
    );
  }
}