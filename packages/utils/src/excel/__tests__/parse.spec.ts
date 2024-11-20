import { resolve } from 'node:path';
import * as ExcelJS from 'exceljs';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { ParseExcel } from '../index';

// Mock FileReader before tests
vi.stubGlobal('FileReader', class {
  onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;

  readAsArrayBuffer(blob: Blob) {
    setTimeout(() => {
      const self = this as any;
      if (this.onload) {
        self.onload({
          target: { result: blob },
        } as any);
      }
    }, 0);
  }
});

describe('parseExcel', () => {
  let parser: ParseExcel;
  let excelFile: File;

  beforeAll(async () => {
    // 1. 使用 exceljs 读取 Excel 文件
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(resolve(__dirname, './mock/demo.xlsx'));

    // 2. 将 workbook 写入 buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // 3. 将 buffer 转换为 Blob
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // 4. 创建 File 对象
    excelFile = new File([blob], 'demo.xlsx', { type: blob.type });
  });

  beforeEach(async () => {
    parser = new ParseExcel();
    await parser.init(excelFile);
  });

  describe('基础功能', () => {
    it('应该正确初始化Excel文件', () => {
      expect(parser.sheetNames.length).toBeGreaterThan(0);
    });

    it('应该能获取工作表名称列表', () => {
      const sheetNames = parser.sheetNames;
      expect(Array.isArray(sheetNames)).toBe(true);
      expect(sheetNames.length).toBeGreaterThan(0);
    });
  });

  describe('数据解析', () => {
    it('应该能获取表格数据', () => {
      const data = parser.getData();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });

    it('应该能正确解析日期类型', () => {
      const fields = parser.getFieldsMate();
      const data = parser.getData();

      const dateFields = fields.filter(f => f.valueType === 'date');
      if (dateFields.length) {
        const firstDateField = dateFields[0];
        const firstRow = data[0] as { [key: string]: any };
        expect(typeof firstRow[firstDateField.id]).toBe('number');
      }
    });
  });

  describe('字段元数据', () => {
    it('应该能获取字段信息', () => {
      const fields = parser.getFieldsMate();
      expect(Array.isArray(fields)).toBe(true);
      expect(fields.length).toBeGreaterThan(0);

      const firstField = fields[0];
      expect(firstField).toHaveProperty('id');
      expect(firstField).toHaveProperty('name');
      expect(firstField).toHaveProperty('valueType');
    });

    it('应该能获取表格范围', () => {
      const [start, end] = parser.getRange();
      expect(typeof start).toBe('number');
      expect(typeof end).toBe('number');
      expect(end).toBeGreaterThanOrEqual(start);
    });
  });
});
