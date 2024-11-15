import { Filesystem, Directory } from '@capacitor/filesystem';
import { FolderPicker } from 'capacitor-folder-picker';

interface ImageFile {
  name: string;
  path: string;
  data: string;
}

export const isImageFile = (fileName: string): boolean => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
};

export const loadImagesFromFolder = async (path: string): Promise<{ result?: ImageFile[], error?: any }> => {
  try {
    const result = await Filesystem.readdir({
      path,
      directory: Directory.External
    });

    const images: ImageFile[] = [];
    
    for (const file of result.files) {
      if (isImageFile(file.name)) {
        const fileContent = await Filesystem.readFile({
          path: `${path}/${file.name}`,
          directory: Directory.External
        });

        images.push({
          name: file.name,
          path: `${path}/${file.name}`,
          data: fileContent.data as string
        });
      }
    }

    return { result: images };
  } catch (error) {
    console.error('Error loading images:', error);
    return { error };
  }
};

export const createFolder = async (basePath: string, folderName: string): Promise<{ result?: boolean | null, error?: any }> => {
  try {
    await Filesystem.mkdir({
      path: `${basePath}/${folderName}`,
      directory: Directory.External,
      recursive: true
    });

    return { result: true, error: null };
  } catch (error) {
    console.error('Error creating folder:', error);
    return { result: null, error };
  }
};

export const moveImageToFolder = async (basePath: string, imagePath: string, folderName: string): Promise<{ result?: boolean | null, error?: any }> => {
  try {
    const fileName = imagePath.split('/').pop();
    if (!fileName) throw new Error('Invalid image path');

    await Filesystem.rename({
      from: imagePath,
      to: `${basePath}/${folderName}/${fileName}`,
      directory: Directory.External
    });

    return { result: true, error: null };
  } catch (error) {
    console.error('Error moving image:', error);
    return { error, result: null };
  }
};

export async function pickFolder(): Promise<{ result?: string, error?: any }> {
  try {
    const result = await FolderPicker.chooseFolder();
    console.log('Selected folder path:', result.value);
    return { result: result.value };
  } catch (error) {
    console.error('Error picking folder:', error);
    return { error };
  }
}

export async function listFolders(folderPath: string): Promise<{ result?: { folderPath: string, folders: string[] }, error?: any }> {
  try {
    const contents = await Filesystem.readdir({
      path: folderPath,
      directory: Directory.Documents
    });

    const folderPromises = contents.files.map(async (item) => {
      const statResult = await Filesystem.stat({
        path: `${folderPath}/${item}`,
        directory: Directory.Documents
      });
      return { name: item, isFolder: statResult.type === 'directory' };
    });

    const folderDetails = await Promise.all(folderPromises);
    const folders = folderDetails.filter((item) => item.isFolder).map((item) => item.name);

    return { result: { folderPath, folders: folders.map(folder => folder.name) } };
  } catch (error) {
    console.error('Error listing folders:', error);
    alert('An error occurred while listing folders. Please check the console for details.');
    return { error };
  }
}
