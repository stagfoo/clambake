import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { parse, stringify } from 'yaml'
import { Keyboard } from '@capacitor/keyboard';
import { ACTIONS } from './domain';

const yamlPath = 'db.yaml'
export function normalizeDataForHumanReadability(data: any) {
    return {
        data: data.createdAt,
        message: data.message,
        author: data.name,
        image: data.image,
    }
}
export async function saveDByaml(jsonData: any, path: string){

    const yamlString = stringify(normalizeDataForHumanReadability(jsonData), {  collectionStyle: "block" })
    await Filesystem.writeFile({
        path,
        data: yamlString,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
    
    // Save file to device
    // Use capacitor-blob-writer to write a blob to a file
    // accept a string to write to the file
    // accept a path to write the file to including the file name
    // return a promise 
}

export async function loadFile(){
    const contents = await Filesystem.readFile({
        path: yamlPath,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      console.log('yaml:', parse(contents.data.toString()));
    // Load file from device
    // Use capacitor-filesystem to read a file from the device
    // accept a path to the file to read
    // return a promise
    // const parsedData = parse(yamlString)
}

export async function listFiles() {
    // List files in a directory
    // Use capacitor-filesystem to list the files in a directory
    // accept a path to the directory to list
    // return a promise

    // Do i want a list file with all the files in the directory
    // or
    // Do i want to list the files in the directory every time i open the app
}


//TODO do i want a keyboard event bus?
Keyboard.addListener('keyboardWillShow', info => {
    ACTIONS.emit('keyboardWillShow', info.keyboardHeight)
});

Keyboard.addListener('keyboardDidShow', info => {
    ACTIONS.emit('keyboardDidShow', info.keyboardHeight);
});

Keyboard.addListener('keyboardWillHide', () => {
    ACTIONS.emit('keyboardWillHide', true);
});

Keyboard.addListener('keyboardDidHide', () => {
    ACTIONS.emit('keyboardDidHide', true);
});

