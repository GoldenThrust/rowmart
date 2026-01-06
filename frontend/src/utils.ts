export function formatNumber(num: number | string): string {
  return parseFloat(Number(num).toFixed(3)).toString();
}


export const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));