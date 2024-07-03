export function generateRandomID() {
  const length = 8;
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let id = '';
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  // 使用当前时间戳和随机数生成唯一ID
  return `id-${Date.now()}${id}`;
}
