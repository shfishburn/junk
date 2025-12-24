export interface Prize {
  id: string;
  label: string;
  emoji: string;
  description: string;
  color: string;
  weight: number; // Higher = more likely
}

export const PRIZES: Prize[] = [
  {
    id: "10-percent",
    label: "10% Off",
    emoji: "🎉",
    description: "10% off your first haul!",
    color: "hsl(152, 35%, 42%)", // primary
    weight: 25,
  },
  {
    id: "free-heavy",
    label: "Free Heavy",
    emoji: "💪",
    description: "Free heavy item pickup!",
    color: "hsl(45, 93%, 47%)", // gold
    weight: 10,
  },
  {
    id: "25-off",
    label: "$25 Off",
    emoji: "🌟",
    description: "$25 off your order!",
    color: "hsl(200, 70%, 50%)", // blue
    weight: 20,
  },
  {
    id: "double-donation",
    label: "2x Receipt",
    emoji: "🗑️",
    description: "Double donation receipt!",
    color: "hsl(280, 60%, 55%)", // purple
    weight: 15,
  },
  {
    id: "mystery",
    label: "Mystery!",
    emoji: "🎁",
    description: "Mystery discount - call to reveal!",
    color: "hsl(330, 70%, 50%)", // pink
    weight: 5,
  },
  {
    id: "no-fees",
    label: "No Fees",
    emoji: "😅",
    description: "Zero extra fees (already included!)",
    color: "hsl(160, 60%, 45%)", // teal
    weight: 15,
  },
  {
    id: "50-off",
    label: "$50 Off",
    emoji: "🏆",
    description: "$50 off orders $200+!",
    color: "hsl(35, 90%, 50%)", // orange
    weight: 5,
  },
  {
    id: "15-percent",
    label: "15% Off",
    emoji: "🎊",
    description: "15% off your first haul!",
    color: "hsl(120, 40%, 50%)", // green
    weight: 5,
  },
];

export function getWeightedRandomPrize(): Prize {
  const totalWeight = PRIZES.reduce((sum, prize) => sum + prize.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const prize of PRIZES) {
    random -= prize.weight;
    if (random <= 0) {
      return prize;
    }
  }
  
  return PRIZES[0]; // Fallback
}

export function generateDiscountCode(prizeId: string): string {
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `JUNK-${randomPart}`;
}

export function hasSpunToday(): boolean {
  const lastSpin = localStorage.getItem("junk-roulette-spin");
  if (!lastSpin) return false;
  
  const spinDate = new Date(lastSpin);
  const today = new Date();
  
  return (
    spinDate.getDate() === today.getDate() &&
    spinDate.getMonth() === today.getMonth() &&
    spinDate.getFullYear() === today.getFullYear()
  );
}

export function recordSpin(prize: Prize, code: string): void {
  localStorage.setItem("junk-roulette-spin", new Date().toISOString());
  localStorage.setItem("junk-roulette-prize", JSON.stringify({ prize, code }));
}

export function getLastPrize(): { prize: Prize; code: string } | null {
  const saved = localStorage.getItem("junk-roulette-prize");
  if (!saved) return null;
  
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}
