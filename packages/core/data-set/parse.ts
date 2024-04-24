import type { Sheet2JSONOpts, WorkBook } from 'xlsx';
import { read, utils } from 'xlsx';
import type { CellType, Field, RawData } from './types';

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
    const dateFields = fields.filter(f => f.type === 'date');
    if (dateFields.length) {
      result.forEach((row) => {
        dateFields.forEach((f) => {
          const key = f.name as keyof T;
          const value = row[key];
          if (value instanceof Date)
            (row[key] as unknown) = value.getTime();
        });
      });
    }

    return result;
  }

  getRange(sheetName?: string) {
    const sheet = this.getSheet(sheetName);
    if (!sheet['!ref'])
      return [0, 0];

    const [startCell, endCell] = sheet['!ref']?.split(':');
    return [
      utils.decode_col(startCell),
      utils.decode_col(endCell),
    ];
  }

  getFieldsMate(sheetName?: string): Field[] {
    if (this.fields.length)
      return this.fields;

    const sheet = this.getSheet(sheetName);
    if (!sheet['!ref'])
      return [];

    const fields = [];
    const range = sheet['!ref']?.split(':');
    const maxCol = utils.decode_col(range[1].replace(/\d+/, ''));

    for (let i = 0; i <= maxCol; i++) {
      const nameAddress = `${utils.encode_col(i)}1`;
      const valueAddress = `${utils.encode_col(i)}2`;
      const name = sheet[nameAddress].v;
      const type = getCellType(sheet[valueAddress].t);
      fields.push({ name, type });
    }

    this.fields = fields;
    return fields;
  }
}

const CellTypeMap = {
  n: 'number',
  d: 'date',
  s: 'string',
  z: 'null',
} as const;

function getCellType(t: string): CellType {
  if (Object.keys(CellTypeMap).includes(t))
    return CellTypeMap[t as keyof typeof CellTypeMap];
  return 'null';
}
