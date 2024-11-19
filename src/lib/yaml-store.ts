import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { parse, stringify } from 'yaml';
import { Emitter } from 'mitt';

export type DBNormalizer<T> = (data: T[]) => T[];

export class YAMLStore<T> {
  private dbPath: string;
  private entityName: string;
  private rawItems: T[] = [];
  private saveNormalizer: DBNormalizer<T> | undefined;
  private loadNormalizer: DBNormalizer<T> | undefined;

  constructor(options: {
    entityName?: string;
    dbPath?: string;
    saveNormalizer?: DBNormalizer<T>;
    loadNormalizer?: DBNormalizer<T>;
  } = {}) {
    this.dbPath = options.dbPath || 'data.yaml';
    this.saveNormalizer = options.saveNormalizer;
    this.loadNormalizer = options.loadNormalizer;
    this.entityName = options.entityName || 'data';
  }

  async load(): Promise<{ result?: T[], error?: any }> {
    try {
      const { data } = await Filesystem.readFile({
        path: this.dbPath,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });
      
      this.rawItems = parse(data.toString()) as T[] || [];
      let items;
      if (this.loadNormalizer) {
        items = this.loadNormalizer(this.rawItems);
      }
      console.log('load_result', items);
      return { result: items };
    } catch (error) {
      // If file doesn't exist, return empty array
      if (error) {
        return { result: [] };
      }
      return { error };
    }
  }

  async save(items: T[]): Promise<{ result?: boolean, error?: any }> {
    try {
      let dataToSave = this.saveNormalizer 
        ? this.saveNormalizer(items)
        : items;

      const yamlString = stringify(dataToSave, { collectionStyle: "block" });
      const fileResult = await Filesystem.writeFile({
        path: this.dbPath,
        data: yamlString,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });
      console.log('save_result', fileResult);
      return { result: true };
    } catch (error) {
      return { error };
    }
  }

  static async listFiles(): Promise<{ result?: string[], error?: any }> {
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

  public listener(eventbus: Emitter<any>) {
    console.log('wireActions', `save_${String(this.entityName)}`);
    eventbus.on(`save_${String(this.entityName)}`, async (items: T[]) => {
      const result = await this.save(items);
      console.log('save_result', result);
      if (result.error) {
        eventbus.emit(`save_${String(this.entityName)}_error`, result.error);
      } else {
        eventbus.emit(`save_${String(this.entityName)}_success`, true);
      }
    });

    eventbus.on(`load_${String(this.entityName)}`, async () => {
      const result = await this.load();
      if (result.error) {
        eventbus.emit(`load_${String(this.entityName)}_error`, result.error);
      } else {
        eventbus.emit(`load_${String(this.entityName)}_success`, result.result);
      }
    });
  }
}

