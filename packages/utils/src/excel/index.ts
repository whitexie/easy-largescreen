import type { Cell, CellValue, Worksheet } from 'exceljs';
import type { CellType, Field, RawData } from './types';
import { Workbook } from 'exceljs';
import { generateRandomString } from '../utils';

export * from './types';

export class ParseExcel {
  private workbook: Workbook | null = null;
  private fields: Field[] = [];

  async init(file: File) {
    this.fields = [];
    this.workbook = new Workbook();

    // 将File对象转换为ArrayBuffer
    const buffer = await file.arrayBuffer();
    await this.workbook.xlsx.load(buffer);
  }

  get sheetNames() {
    this.workbook.worksheets.map((sheet) => {
      console.log('sheet => ', sheet.name);
      return sheet.name;
    });
    return this.workbook?.worksheets.map(sheet => sheet.name) || [];
  }

  getSheet(sheetName?: string): Worksheet {
    const _sheetName = sheetName || this.sheetNames[0];
    return this.workbook!.getWorksheet(_sheetName);
  }

  getData<T extends RawData>(sheetName?: string) {
    const sheet = this.getSheet(sheetName);

    const fields = this.getFieldsMate(sheetName);
    const result: T[] = [];

    // 从第3行开始读取数据（前两行是字段ID和名称）
    for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber++) {
      const row = sheet.getRow(rowNumber);
      const rowData: any = {};

      fields.forEach((field, index) => {
        const cell = row.getCell(index + 1);
        let value: CellValue = cell.value;

        // 处理日期类型
        if (field.valueType === 'date' && value instanceof Date) {
          value = value.getTime();
        }

        rowData[field.id] = value;
      });

      result.push(rowData as T);
    }
    return result;
  }

  getRange(sheetName?: string): [number, number] {
    const sheet = this.getSheet(sheetName);
    return [1, sheet.columnCount];
  }

  getFieldsMate(sheetName?: string): Field[] {
    if (this.fields.length) {
      return this.fields;
    }

    const sheet = this.getSheet(sheetName);
    const fields: Field[] = [];

    // 读取第一行和第二行来获取字段信息
    const headerRow = sheet.getRow(1);
    const typeRow = sheet.getRow(2);

    for (let col = 1; col <= sheet.columnCount; col++) {
      const valueCell = typeRow.getCell(col);
      const valueType = getCellType(valueCell);

      if (!valueType) {
        continue;
      }

      const id = generateRandomString(8, 'y');
      const nameCell = headerRow.getCell(col);
      const name = nameCell.value as string;

      // 将id设置为表头
      headerRow.getCell(col).value = id;

      fields.push({ id, name, valueType });
    }

    this.fields = fields;
    return fields;
  }
}

function getCellType(cell: Cell): CellType | null {
  switch (cell.type) {
    case 2: // 数字
      return 'number';
    case 3: // 字符串
      return 'string';
    case 4: // 日期
      return 'date';
    default:
      return null;
  }
}
