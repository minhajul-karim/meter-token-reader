export const BN_W: Record<string, string> = {
  '0': 'শূন্য', '1': 'এক', '2': 'দুই', '3': 'তিন', '4': 'চার',
  '5': 'পাঁচ', '6': 'ছয়', '7': 'সাত', '8': 'আট', '9': 'নয়',
};

const BN_D: Record<string, string> = {
  '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
  '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
};

export function toBN(n: number | string): string {
  return String(n).split('').map(d => BN_D[d] ?? d).join('');
}
