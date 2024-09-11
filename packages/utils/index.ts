import { customAlphabet, nanoid } from 'nanoid';

export function generateRandomString(length: number = 8, prefix: string = ''): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = `${prefix}`;
  const charactersLength = characters.length;
  for (let i = 0; i < length - prefix.length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export const generateId = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_', 8);
