import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PRIZES, getWeightedRandomPrize, generateDiscountCode, recordSpin, trackRouletteWin, type Prize } from "@/lib";

interface JunkRouletteProps {
  onComplete: (prize: Prize, code: string) => void;
}

export function JunkRoulette({ onComplete }: JunkRouletteProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wheelSize = 320;
  const centerSize = 60;

  // Draw the wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = wheelSize / 2;
    const centerY = wheelSize / 2;
    const radius = wheelSize / 2 - 10;
    const segmentAngle = (2 * Math.PI) / PRIZES.length;

    // Clear
    ctx.clearRect(0, 0, wheelSize, wheelSize);

    // Draw segments
    PRIZES.forEach((prize, i) => {
      const startAngle = i * segmentAngle - Math.PI / 2;
      const endAngle = startAngle + segmentAngle;

      // Segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = prize.color;
      ctx.fill();

      // Border
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + segmentAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = "bold 13px Inter, sans-serif";
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 2;
      
      // Emoji
      ctx.font = "20px sans-serif";
      ctx.fillText(prize.emoji, radius - 20, 5);
      
      // Label
      ctx.font = "bold 11px Inter, sans-serif";
      ctx.fillText(prize.label, radius - 45, 5);
      
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, centerSize / 2, 0, 2 * Math.PI);
    ctx.fillStyle = "hsl(var(--background))";
    ctx.fill();
    ctx.strokeStyle = "hsl(var(--border))";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Outer ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "hsl(var(--border))";
    ctx.lineWidth = 4;
    ctx.stroke();
  }, []);

  const spin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedPrize(null);

    const prize = getWeightedRandomPrize();
    const prizeIndex = PRIZES.findIndex((p) => p.id === prize.id);
    const segmentAngle = 360 / PRIZES.length;

    // Calculate target rotation
    // We want the prize to land at the top (pointer position)
    // Add extra rotations for effect (5-8 full spins)
    const extraSpins = 5 + Math.floor(Math.random() * 3);
    const targetSegmentPosition = prizeIndex * segmentAngle + segmentAngle / 2;
    // Pointer is at top, so we need to rotate so the segment is at top
    const targetRotation = 360 * extraSpins + (360 - targetSegmentPosition) + 90;

    setRotation((prev) => prev + targetRotation);

    // After spin completes
    setTimeout(() => {
      const code = generateDiscountCode(prize.id);
      recordSpin(prize, code);
      setSelectedPrize(prize);
      setIsSpinning(false);
      
      // Track the win in GA
      trackRouletteWin(prize.label);
      
      // Slight delay for confetti effect
      setTimeout(() => {
        onComplete(prize, code);
      }, 500);
    }, 4000);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Wheel container */}
      <div className="relative">
        {/* Pointer */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
          <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-primary drop-shadow-lg" />
        </div>

        {/* Wheel */}
        <div
          className="relative transition-transform ease-out"
          style={{
            transform: `rotate(${rotation}deg)`,
            transitionDuration: isSpinning ? "4s" : "0s",
            transitionTimingFunction: "cubic-bezier(0.17, 0.67, 0.12, 0.99)",
          }}
        >
          <canvas
            ref={canvasRef}
            width={wheelSize}
            height={wheelSize}
            className="drop-shadow-2xl"
          />
        </div>

        {/* Center button */}
        <button
          onClick={spin}
          disabled={isSpinning}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-lg hover:bg-primary/90 disabled:opacity-50 transition-all hover:scale-105 disabled:hover:scale-100"
        >
          {isSpinning ? "..." : "SPIN"}
        </button>
      </div>

      {!isSpinning && !selectedPrize && (
        <Button onClick={spin} size="lg" className="animate-pulse">
          🎰 Spin the Wheel!
        </Button>
      )}

      {isSpinning && (
        <p className="text-muted-foreground animate-pulse">
          Round and round she goes... 🎲
        </p>
      )}
    </div>
  );
}
