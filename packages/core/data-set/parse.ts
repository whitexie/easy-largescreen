import { read, utils } from "xlsx";
import { type WorkSheet } from "xlsx"


export function parseExcelToJson(file: File): Promise<WorkSheet> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array((e.target as any).result);
      const workbook = read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      resolve(worksheet)
    }
    reader.readAsArrayBuffer(file)
    console.log('parseExcelToJson')
  })
}
