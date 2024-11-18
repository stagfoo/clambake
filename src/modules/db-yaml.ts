import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { parse, stringify } from 'yaml';
import { Todo } from '../types';

const DB_PATH = 'todos.yaml';

export async function loadDB(): Promise<{ result?: Todo[], error?: any }> {
  try {
    const { data } = await Filesystem.readFile({
      path: DB_PATH,
      directory: Directory.Documents,
      encoding: Encoding.UTF8
    });
    
    return { result: parse(data.toString()) as Todo[] || [] };
  } catch (error) {
    // If file doesn't exist, return empty array
    if (error) {
      return { result: [] };
    }
    return { error };
  }
}

export async function saveDB(todos: Todo[]): Promise<{ result?: boolean, error?: any }> {
  try {
    const yamlString = stringify(todos, { collectionStyle: "block" });
    await Filesystem.writeFile({
      path: DB_PATH,
      data: yamlString,
      directory: Directory.Documents,
      encoding: Encoding.UTF8
    });
    return { result: true };
  } catch (error) {
    return { error };
  }
}

export async function listDBFiles(): Promise<{ result?: string[], error?: any }> {
  try {
    const result = await Filesystem.readdir({
      path: '',
      directory: Directory.Documents
    });
    
    // Filter for yaml files only
    const yamlFiles = result.files.filter(file => file.name.endsWith('.yaml'));
    return { result: yamlFiles.map(file => file.name) };
  } catch (error) {
    return { error };
  }
}

