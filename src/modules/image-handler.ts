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
    //Lib Typing is wrong
    const result = await FolderPicker.chooseFolder();
    const folderResult = result as unknown as { path: string };
    return { result: folderResult.path };
  } catch (error) {
    console.log('Error picking folder:', error);
    return { error };
  }
}

export async function listFolders(folderPath: string): Promise<{ result?: { folderPath: string, folders: string[] }, error?: any }> {
  // Step 1: Read directory contents
  let contents;
  try {
    contents = await Filesystem.readdir({
      path: 'DCIM',
      directory: Directory.ExternalStorage
    });
    console.log('Step 1 - Directory contents:', contents);
  } catch (error) {
    console.error('Error reading directory:', error);
    return { error: 'Failed to read directory' };
  }

  // Step 2: Create stat promises
  let folderPromises;
  try {
    folderPromises = contents.files.map(async (item) => {
      const statResult = await Filesystem.stat({
        path: `${folderPath}/${item}`,
        directory: Directory.Documents
      });
      return { name: item, isFolder: statResult.type === 'directory' };
    });
    console.log('Step 2 - Created folder promises');
  } catch (error) {
    console.error('Error creating stat promises:', error);
    return { error: 'Failed to create stat promises' };
  }

  // Step 3: Resolve promises and filter folders
  let folderDetails;
  try {
    folderDetails = await Promise.all(folderPromises);
    console.log('Step 3 - Processed folders:', folderDetails);
  } catch (error) {
    console.error('Error resolving promises:', error);
    return { error: 'Failed to resolve promises' };
  }
  // Step 4: Filter folders and return result
  try {
    if(folderDetails) {
      console.log('folderDetails', folderDetails)
      const folders = folderDetails.filter((item) => item.isFolder).map((item) => item.name);
      console.log('folders', folders); 
      const folderList = folders.map((folder) => folder.name);
      console.log('Step 4 - Filtered folders:', folderList);
      return { result: { folderPath, folders: folderList } };
    }
    return { error: 'No folder details available' };
  } catch (error) {
    console.error('Error processing folder details:', error);
    return { error: 'Failed to process folder details' };
  }
}

// Validation functions
export const validateFolderName = (name: string): boolean => {
  const MAX_FOLDER_NAME_LENGTH = 50;
  if (!name || !name.trim()) throw new Error('Folder name cannot be empty');
  if (name.length > MAX_FOLDER_NAME_LENGTH) throw new Error(`Folder name cannot exceed ${MAX_FOLDER_NAME_LENGTH} characters`);
  if (!/^[a-zA-Z0-9-_\s]+$/.test(name)) throw new Error('Folder name can only contain letters, numbers, spaces, hyphens, and underscores');
  return true;
};