const EXIT_POPUP_KEY = 'junk-exit-popup-seen';
const EXIT_DISCOUNT_KEY = 'junk-exit-discount';
const COOLOFF_DAYS = 7;

interface ExitDiscountData {
  code: string;
  claimedAt: string;
}

export function hasSeenExitPopup(): boolean {
  const seen = localStorage.getItem(EXIT_POPUP_KEY);
  if (!seen) return false;
  
  const seenDate = new Date(seen);
  const now = new Date();
  const daysDiff = (now.getTime() - seenDate.getTime()) / (1000 * 60 * 60 * 24);
  
  // Reset after cooloff period
  if (daysDiff > COOLOFF_DAYS) {
    localStorage.removeItem(EXIT_POPUP_KEY);
    return false;
  }
  
  return true;
}

export function markExitPopupSeen(): void {
  localStorage.setItem(EXIT_POPUP_KEY, new Date().toISOString());
}

export function hasClaimedExitDiscount(): boolean {
  return localStorage.getItem(EXIT_DISCOUNT_KEY) !== null;
}

export function markExitDiscountClaimed(code: string): void {
  const data: ExitDiscountData = {
    code,
    claimedAt: new Date().toISOString(),
  };
  localStorage.setItem(EXIT_DISCOUNT_KEY, JSON.stringify(data));
}

export function getExitDiscountCode(): string | null {
  const data = localStorage.getItem(EXIT_DISCOUNT_KEY);
  if (!data) return null;
  
  try {
    const parsed: ExitDiscountData = JSON.parse(data);
    return parsed.code;
  } catch {
    return null;
  }
}

export function generateExitDiscountCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'STAY-';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
