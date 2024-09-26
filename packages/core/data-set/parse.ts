import type { Sheet2JSONOpts, WorkBook } from 'xlsx';
import type { CellType, Field, RawData } from './types';
import { generateRandomString } from '@yss/utils';
import { read, utils } from 'xlsx';

function readExcel(file: File): Promise<WorkBook> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array((e.target as any).result);
      const workbook = read(data, { type: 'array', cellDates: true });
      resolve(workbook);
    };
    reader.readAsArrayBuffer(file);
  });
}

export class ParseExcel {
  private workbook: WorkBook | null = null;
  private file: File | null = null;
  private fields: Field[] = [];

  async init(file: File) {
    this.fields = [];
    this.file = file;
    this.workbook = await readExcel(this.file);
  }

  get sheetNames() {
    return this.workbook?.SheetNames || [];
  }

  getSheet(sheetName?: string) {
    const _sheetName = sheetName || this.sheetNames[0];
    return this.workbook!.Sheets[_sheetName];
  }

  getData<T extends RawData>(sheetName?: string, opts: Sheet2JSONOpts = { header: 'A' }) {
    const sheet = this.getSheet(sheetName);
    const result = utils.sheet_to_json<T>(sheet, opts);
    const fields = this.getFieldsMate(sheetName);
    const dateFields = fields.filter(f => f.valueType === 'date');
    if (dateFields.length) {
      result.forEach((row) => {
        dateFields.forEach((f) => {
          const key = f.id as keyof T;
          const value = row[key];
          if (value instanceof Date) {
            (row[key] as unknown) = value.getTime();
          }
        });
      });
    }

    return result;
  }

  getRange(sheetName?: string) {
    const sheet = this.getSheet(sheetName);
    if (!sheet['!ref']) {
      return [0, 0];
    }

    const [startCell, endCell] = sheet['!ref']?.split(':');
    return [
      utils.decode_col(startCell),
      utils.decode_col(endCell),
    ];
  }

  getFieldsMate(sheetName?: string): Field[] {
    if (this.fields.length) {
      return this.fields;
    }

    const sheet = this.getSheet(sheetName);
    if (!sheet['!ref']) {
      return [];
    }

    const fields: Field[] = [];
    const range = sheet['!ref']?.split(':');
    const maxCol = utils.decode_col(range[1].replace(/\d+/, ''));

    for (let i = 0; i <= maxCol; i++) {
      const valueAddress = `${utils.encode_col(i)}2`;
      const valueType = getCellType(sheet[valueAddress].t);
      if (!valueType) {
        continue;
      }
      const id = generateRandomString(8, 'y');
      const nameAddress = `${utils.encode_col(i)}1`;
      const name = sheet[nameAddress].v;

      // 将id作为表头
      sheet[nameAddress].v = id;
      sheet[nameAddress].h = id;
      sheet[nameAddress].w = id;
      fields.push({ id, name, valueType });
    }

    this.fields = fields;
    return fields;
  }
}

const CellTypeMap = {
  n: 'number',
  d: 'date',
  s: 'string',
} as const;

function getCellType(t: string): CellType | null {
  if (Object.keys(CellTypeMap).includes(t)) {
    return CellTypeMap[t as keyof typeof CellTypeMap];
  }

  return null;
}
