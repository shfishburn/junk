export interface BingoItem {
  id: string;
  name: string;
  emoji: string;
  category: "furniture" | "electronics" | "appliances" | "garage" | "clutter" | "misc";
}

export const BINGO_ITEMS: BingoItem[] = [
  // Furniture
  { id: "couch", name: "Old Couch", emoji: "🛋️", category: "furniture" },
  { id: "mattress", name: "Mattress", emoji: "🛏️", category: "furniture" },
  { id: "dresser", name: "Dresser", emoji: "🗄️", category: "furniture" },
  { id: "desk", name: "Old Desk", emoji: "🪑", category: "furniture" },
  { id: "chair", name: "Broken Chair", emoji: "💺", category: "furniture" },
  { id: "table", name: "Dining Table", emoji: "🪵", category: "furniture" },
  { id: "bookshelf", name: "Bookshelf", emoji: "📚", category: "furniture" },
  
  // Electronics
  { id: "crt-tv", name: "CRT TV", emoji: "📺", category: "electronics" },
  { id: "computer", name: "Old Computer", emoji: "🖥️", category: "electronics" },
  { id: "printer", name: "Broken Printer", emoji: "🖨️", category: "electronics" },
  { id: "vcr", name: "VCR/DVD Player", emoji: "📼", category: "electronics" },
  { id: "cables", name: "Box of Cables", emoji: "🔌", category: "electronics" },
  { id: "speakers", name: "Old Speakers", emoji: "🔊", category: "electronics" },
  { id: "keyboard", name: "Keyboards", emoji: "⌨️", category: "electronics" },
  
  // Appliances
  { id: "mini-fridge", name: "Mini Fridge", emoji: "🧊", category: "appliances" },
  { id: "microwave", name: "Microwave", emoji: "📦", category: "appliances" },
  { id: "vacuum", name: "Old Vacuum", emoji: "🧹", category: "appliances" },
  { id: "heater", name: "Space Heater", emoji: "🔥", category: "appliances" },
  { id: "fan", name: "Broken Fan", emoji: "💨", category: "appliances" },
  { id: "washer", name: "Washer/Dryer", emoji: "🫧", category: "appliances" },
  
  // Garage/Yard
  { id: "mower", name: "Lawn Mower", emoji: "🌿", category: "garage" },
  { id: "tires", name: "Old Tires", emoji: "🛞", category: "garage" },
  { id: "paint", name: "Paint Cans", emoji: "🎨", category: "garage" },
  { id: "lumber", name: "Scrap Lumber", emoji: "🪵", category: "garage" },
  { id: "tools", name: "Rusty Tools", emoji: "🔧", category: "garage" },
  { id: "grill", name: "Old Grill", emoji: "🍖", category: "garage" },
  { id: "bikes", name: "Broken Bikes", emoji: "🚲", category: "garage" },
  
  // Clutter
  { id: "boxes", name: "Mystery Boxes", emoji: "📦", category: "clutter" },
  { id: "exercise", name: "Exercise Equipment", emoji: "🏋️", category: "clutter" },
  { id: "toys", name: "Old Toys", emoji: "🧸", category: "clutter" },
  { id: "holiday", name: "Holiday Decor", emoji: "🎄", category: "clutter" },
  { id: "clothes", name: "Bags of Clothes", emoji: "👕", category: "clutter" },
  { id: "books", name: "Stacks of Books", emoji: "📖", category: "clutter" },
  
  // Misc
  { id: "carpet", name: "Old Carpet", emoji: "🟫", category: "misc" },
  { id: "doors", name: "Doors", emoji: "🚪", category: "misc" },
  { id: "windows", name: "Windows", emoji: "🪟", category: "misc" },
  { id: "cabinets", name: "Filing Cabinets", emoji: "🗃️", category: "misc" },
  { id: "mirrors", name: "Old Mirrors", emoji: "🪞", category: "misc" },
  { id: "blinds", name: "Blinds/Curtains", emoji: "🎭", category: "misc" },
  { id: "lamps", name: "Lamps", emoji: "💡", category: "misc" },
];

export interface BingoCard {
  items: (BingoItem | "FREE")[];
  checked: boolean[];
  createdAt: string;
}

export interface DiscountTier {
  lines: number;
  discount: string;
  title: string;
  description: string;
}

export const DISCOUNT_TIERS: DiscountTier[] = [
  { lines: 1, discount: "5%", title: "Bingo Beginner", description: "1 line completed" },
  { lines: 2, discount: "10%", title: "Junk Collector", description: "2 lines completed" },
  { lines: 3, discount: "15%", title: "Hoarder Hero", description: "3 lines completed" },
  { lines: 5, discount: "20% + Free Heavy Item", title: "Bingo Master", description: "BLACKOUT!" },
];

// Generate a randomized 5x5 bingo card
export function generateBingoCard(): BingoCard {
  const shuffled = [...BINGO_ITEMS].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 24); // 24 items + 1 FREE center
  
  // Insert FREE in center (index 12)
  const items: (BingoItem | "FREE")[] = [
    ...selected.slice(0, 12),
    "FREE",
    ...selected.slice(12),
  ];
  
  // Center (FREE) is always checked
  const checked = new Array(25).fill(false);
  checked[12] = true;
  
  return {
    items,
    checked,
    createdAt: new Date().toISOString(),
  };
}

// Check for completed lines (rows, columns, diagonals)
export function getCompletedLines(checked: boolean[]): number[][] {
  const lines: number[][] = [];
  
  // Rows
  for (let row = 0; row < 5; row++) {
    const rowIndices = [0, 1, 2, 3, 4].map(col => row * 5 + col);
    if (rowIndices.every(i => checked[i])) {
      lines.push(rowIndices);
    }
  }
  
  // Columns
  for (let col = 0; col < 5; col++) {
    const colIndices = [0, 1, 2, 3, 4].map(row => row * 5 + col);
    if (colIndices.every(i => checked[i])) {
      lines.push(colIndices);
    }
  }
  
  // Diagonals
  const diag1 = [0, 6, 12, 18, 24];
  const diag2 = [4, 8, 12, 16, 20];
  
  if (diag1.every(i => checked[i])) lines.push(diag1);
  if (diag2.every(i => checked[i])) lines.push(diag2);
  
  return lines;
}

export function getLineCount(checked: boolean[]): number {
  return getCompletedLines(checked).length;
}

export function getCurrentTier(lineCount: number): DiscountTier | null {
  if (lineCount >= 5) return DISCOUNT_TIERS[3]; // Blackout (all 12 possible lines means full board)
  if (lineCount >= 3) return DISCOUNT_TIERS[2];
  if (lineCount >= 2) return DISCOUNT_TIERS[1];
  if (lineCount >= 1) return DISCOUNT_TIERS[0];
  return null;
}

export function isBlackout(checked: boolean[]): boolean {
  return checked.every(c => c);
}

export function generateBingoCode(tier: DiscountTier): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `BINGO-${code}`;
}

// LocalStorage helpers
const STORAGE_KEY = "junk-bingo";

export function saveBingoState(card: BingoCard, discountCode?: string): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    card,
    discountCode,
    savedAt: new Date().toISOString(),
  }));
}

export function loadBingoState(): { card: BingoCard; discountCode?: string } | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const data = JSON.parse(stored);
    
    // Check if card is older than 7 days
    const savedAt = new Date(data.savedAt);
    const now = new Date();
    const daysDiff = (now.getTime() - savedAt.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysDiff > 7) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    
    return data;
  } catch {
    return null;
  }
}

export function clearBingoState(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getCheckedCount(checked: boolean[]): number {
  return checked.filter(c => c).length;
}

// Track if bingo was shown for current estimate session
const BINGO_SHOWN_KEY = "junk-bingo-shown";

export function wasBingoShownForEstimate(): boolean {
  const shown = localStorage.getItem(BINGO_SHOWN_KEY);
  if (!shown) return false;
  
  // Check if within same day
  const shownDate = new Date(shown);
  const now = new Date();
  return shownDate.toDateString() === now.toDateString();
}

export function markBingoShown(): void {
  localStorage.setItem(BINGO_SHOWN_KEY, new Date().toISOString());
}

export function resetBingoShown(): void {
  localStorage.removeItem(BINGO_SHOWN_KEY);
}
