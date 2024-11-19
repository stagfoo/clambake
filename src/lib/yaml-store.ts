import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { parse, stringify } from 'yaml';
import { Emitter } from 'mitt';

export type DBNormalizer<T> = (data: T[]) => T[];

export class YAMLStore<T> {
  private dbPath: string;
  private rawItems: T[] = [];
  private saveNormalizer: DBNormalizer<T> | undefined;
  private loadNormalizer: DBNormalizer<T> | undefined;

  constructor(options: {
    dbPath?: string;
    saveNormalizer?: DBNormalizer<T>;
    loadNormalizer?: DBNormalizer<T>;
  } = {}) {
    this.dbPath = options.dbPath || 'data.yaml';
    this.saveNormalizer = options.saveNormalizer;
    this.loadNormalizer = options.loadNormalizer;
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
      await Filesystem.writeFile({
        path: this.dbPath,
        data: yamlString,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });
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

  public wireActions(actions: Emitter<any>) {
    actions.on(`save_${this.dbPath}`, async (items: T[]) => {
      const result = await this.save(items);
      if (result.error) {
        actions.emit(`save_${this.dbPath}_error`, result.error);
      } else {
        actions.emit(`save_${this.dbPath}_success`, true);
      }
    });

    actions.on(`load_${this.dbPath}`, async () => {
      const result = await this.load();
      if (result.error) {
        actions.emit(`load_${this.dbPath}_error`, result.error);
      } else {
        actions.emit(`load_${this.dbPath}_success`, result.result);
      }
    });
  }
}

