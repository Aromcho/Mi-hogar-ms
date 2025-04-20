import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as Fuse from 'fuse.js';   // ← namespace

interface DirOption {
  value: string;
  secundvalue?: string;
}

@Injectable()
export class AutocompleteService {
  private fuse: any;

  constructor() {
    const filePath = path.join(process.cwd(),  'direcciones_y_barrios.json');
    const json = fs.readFileSync(filePath, 'utf-8');
    const data: DirOption[] = JSON.parse(json);

    const options = { keys: ['value'], threshold: 0.3 };

    // 👇 al ser namespace, casteamos a any
    this.fuse = new (Fuse as any)(data, options);
  }

  search(q: string) {
    try {
      return this.fuse.search(q).map(({ item }) => ({
        value: item.value,
        secundvalue: item.secundvalue ?? '',
      }));
    } catch (e) {
      throw new InternalServerErrorException('Error en autocompletado');
    }
  }
}