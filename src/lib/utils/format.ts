/**
 * Currency & Number Formatting Utility for ParkZone Admin
 * Formats large amounts using K, M, B, T notations
 */

export function formatCurrency(
  amount: number | null | undefined,
  currency: string = "RWF"
): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `0 ${currency}`;
  }

  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";

  // Trillions
  if (abs >= 1e12) {
    const formatted = (abs / 1e12).toFixed(1).replace(/\.0$/, "");
    return `${sign}${formatted}T ${currency}`;
  }

  // Billions
  if (abs >= 1e9) {
    const formatted = (abs / 1e9).toFixed(1).replace(/\.0$/, "");
    return `${sign}${formatted}B ${currency}`;
  }

  // Millions
  if (abs >= 1e6) {
    const formatted = (abs / 1e6).toFixed(1).replace(/\.0$/, "");
    return `${sign}${formatted}M ${currency}`;
  }

  // Thousands (only if >= 10,000 or for compact financial display)
  if (abs >= 1e3) {
    const formatted = (abs / 1e3).toFixed(1).replace(/\.0$/, "");
    return `${sign}${formatted}K ${currency}`;
  }

  return `${sign}${abs.toLocaleString()} ${currency}`;
}

export function formatNumberCompact(num: number | null | undefined): string {
  if (num === null || num === undefined || isNaN(num)) {
    return "0";
  }

  const abs = Math.abs(num);
  const sign = num < 0 ? "-" : "";

  if (abs >= 1e12) return `${sign}${(abs / 1e12).toFixed(1).replace(/\.0$/, "")}T`;
  if (abs >= 1e9) return `${sign}${(abs / 1e9).toFixed(1).replace(/\.0$/, "")}B`;
  if (abs >= 1e6) return `${sign}${(abs / 1e6).toFixed(1).replace(/\.0$/, "")}M`;
  if (abs >= 1e3) return `${sign}${(abs / 1e3).toFixed(1).replace(/\.0$/, "")}K`;

  return `${sign}${abs.toLocaleString()}`;
}
