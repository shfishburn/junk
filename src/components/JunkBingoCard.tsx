import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check, Star } from "lucide-react";
import {
  type BingoCard,
  type BingoItem,
  getCompletedLines,
  getLineCount,
  getCurrentTier,
  isBlackout,
  DISCOUNT_TIERS,
  getCheckedCount,
} from "@/lib/bingo-items";

interface JunkBingoCardProps {
  card: BingoCard;
  onCheck: (index: number) => void;
  onLineComplete?: (lineCount: number) => void;
}

export function JunkBingoCard({ card, onCheck, onLineComplete }: JunkBingoCardProps) {
  const [completedIndices, setCompletedIndices] = useState<Set<number>>(new Set());
  const [lastLineCount, setLastLineCount] = useState(0);
  const [recentlyChecked, setRecentlyChecked] = useState<number | null>(null);

  const lineCount = getLineCount(card.checked);
  const currentTier = getCurrentTier(lineCount);
  const blackout = isBlackout(card.checked);
  const checkedCount = getCheckedCount(card.checked);
  const completedLines = getCompletedLines(card.checked);

  // Update completed indices
  useEffect(() => {
    const newCompleted = new Set<number>();
    completedLines.forEach(line => line.forEach(i => newCompleted.add(i)));
    setCompletedIndices(newCompleted);
  }, [card.checked]);

  // Notify when lines are completed
  useEffect(() => {
    if (lineCount > lastLineCount) {
      onLineComplete?.(lineCount);
    }
    setLastLineCount(lineCount);
  }, [lineCount, lastLineCount, onLineComplete]);

  const handleCheck = (index: number) => {
    if (card.items[index] === "FREE") return;
    setRecentlyChecked(index);
    setTimeout(() => setRecentlyChecked(null), 300);
    onCheck(index);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Progress section */}
      <div className="mb-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Items checked</span>
          <span className="font-medium">{checkedCount}/25</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(checkedCount / 25) * 100}%` }}
          />
        </div>
        
        {/* Tier milestones */}
        <div className="flex justify-between text-xs text-muted-foreground pt-1">
          {DISCOUNT_TIERS.map((tier, i) => (
            <div
              key={tier.lines}
              className={cn(
                "flex flex-col items-center transition-colors",
                lineCount >= tier.lines && "text-primary font-medium"
              )}
            >
              <span>{tier.discount}</span>
              <span>{tier.lines === 5 ? "Full" : `${tier.lines}L`}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Current tier badge */}
      {currentTier && (
        <div className={cn(
          "mb-4 p-3 rounded-lg text-center transition-all",
          blackout 
            ? "bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 border-2 border-primary" 
            : "bg-primary/10 border border-primary/20"
        )}>
          <div className="flex items-center justify-center gap-2">
            {blackout && <Star className="w-5 h-5 text-primary fill-primary animate-pulse" />}
            <span className="font-bold text-primary">{currentTier.title}</span>
            {blackout && <Star className="w-5 h-5 text-primary fill-primary animate-pulse" />}
          </div>
          <p className="text-sm text-muted-foreground">{currentTier.discount} off your next pickup!</p>
        </div>
      )}

      {/* Bingo grid */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 p-3 bg-card rounded-xl border shadow-lg">
        {card.items.map((item, index) => {
          const isFree = item === "FREE";
          const isChecked = card.checked[index];
          const isInCompletedLine = completedIndices.has(index);
          const isRecent = recentlyChecked === index;

          return (
            <button
              key={index}
              onClick={() => handleCheck(index)}
              disabled={isFree}
              className={cn(
                "aspect-square rounded-lg flex flex-col items-center justify-center p-1 transition-all duration-200 relative overflow-hidden",
                "text-xs sm:text-sm font-medium",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                !isChecked && !isFree && "bg-muted hover:bg-muted/80 hover:scale-105 active:scale-95 cursor-pointer",
                isChecked && !isFree && "bg-primary/20 text-primary",
                isChecked && isInCompletedLine && "bg-primary text-primary-foreground",
                isFree && "bg-primary text-primary-foreground cursor-default",
                isRecent && "animate-scale-in"
              )}
            >
              {/* Stamp effect overlay */}
              {isChecked && !isFree && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Check 
                    className={cn(
                      "w-8 h-8 sm:w-10 sm:h-10 opacity-20",
                      isInCompletedLine ? "text-primary-foreground" : "text-primary"
                    )} 
                    strokeWidth={3}
                  />
                </div>
              )}
              
              <span className="text-lg sm:text-xl leading-none relative z-10">
                {isFree ? "⭐" : (item as BingoItem).emoji}
              </span>
              <span className={cn(
                "leading-tight text-center relative z-10 mt-0.5",
                "text-[9px] sm:text-[10px]",
                isChecked && isInCompletedLine && "text-primary-foreground"
              )}>
                {isFree ? "FREE" : (item as BingoItem).name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Instructions */}
      <p className="text-center text-xs text-muted-foreground mt-3">
        Tap items you have • Complete lines to unlock discounts
      </p>
    </div>
  );
}
