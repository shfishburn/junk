import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { JunkRoulette } from "./JunkRoulette";
import { ReferralWidget } from "@/components/shared";
import { hasSpunToday, getLastPrize, type Prize } from "@/lib";
import { Copy, Check, PartyPopper, Gift } from "lucide-react";
import { useToast } from "@/hooks";

interface JunkRouletteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerName?: string;
  customerEmail?: string;
}

export function JunkRouletteModal({
  open,
  onOpenChange,
  customerName,
  customerEmail,
}: JunkRouletteModalProps) {
  const [phase, setPhase] = useState<"spin" | "prize" | "referral">("spin");
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [discountCode, setDiscountCode] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();

  // Check if already spun today
  useEffect(() => {
    if (open) {
      if (hasSpunToday()) {
        const lastPrize = getLastPrize();
        if (lastPrize) {
          setWonPrize(lastPrize.prize);
          setDiscountCode(lastPrize.code);
          setPhase("prize");
        }
      } else {
        setPhase("spin");
        setWonPrize(null);
        setDiscountCode("");
      }
    }
  }, [open]);

  const handleSpinComplete = (prize: Prize, code: string) => {
    setWonPrize(prize);
    setDiscountCode(code);
    setShowConfetti(true);
    setPhase("prize");

    // Hide confetti after animation
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(discountCode);
    setCopied(true);
    toast({
      title: "Code copied!",
      description: "Paste it when you book your pickup.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const goToReferral = () => {
    setPhase("referral");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md overflow-hidden">
        {/* Confetti effect */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-20px`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${1 + Math.random()}s`,
                }}
              >
                <span className="text-2xl">
                  {["🎉", "✨", "🌟", "🎊", "💫"][Math.floor(Math.random() * 5)]}
                </span>
              </div>
            ))}
          </div>
        )}

        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {phase === "spin" && "🎰 Spin the Wheel of Junk Fortune!"}
            {phase === "prize" && (
              <span className="flex items-center justify-center gap-2">
                <PartyPopper className="h-5 w-5 text-primary" />
                You Won!
                <PartyPopper className="h-5 w-5 text-primary" />
              </span>
            )}
            {phase === "referral" && (
              <span className="flex items-center justify-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                Spread the Junk Love
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {phase === "spin" && (
            <div className="space-y-4">
              <p className="text-center text-muted-foreground text-sm">
                Every spin's a winner. Just like hiring us to haul your stuff.
              </p>
              <JunkRoulette onComplete={handleSpinComplete} />
            </div>
          )}

          {phase === "prize" && wonPrize && (
            <div className="space-y-6 text-center animate-in fade-in duration-500">
              <div className="text-6xl">{wonPrize.emoji}</div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-charcoal">
                  {wonPrize.description}
                </h3>
                <p className="text-muted-foreground text-sm">
                  Look at you, high roller! Here's your prize:
                </p>
              </div>

              {/* Discount code */}
              <div className="p-4 rounded-lg bg-primary/10 border-2 border-primary/30">
                <p className="text-xs text-muted-foreground mb-2">
                  Your discount code:
                </p>
                <div className="flex items-center justify-center gap-2">
                  <code className="text-2xl font-mono font-bold text-primary tracking-wider">
                    {discountCode}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyCode}
                    className="h-8 w-8"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Mention this code when we call to confirm your pickup!
              </p>

              <div className="flex flex-col gap-3">
                <Button onClick={copyCode} className="w-full">
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Code
                    </>
                  )}
                </Button>

                <Button variant="outline" onClick={goToReferral}>
                  <Gift className="mr-2 h-4 w-4" />
                  Share & Get $25 Off
                </Button>
              </div>
            </div>
          )}

          {phase === "referral" && (
            <div className="animate-in fade-in duration-300">
              <ReferralWidget
                referrerName={customerName}
                referrerEmail={customerEmail}
                variant="compact"
              />
              <div className="mt-4">
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setPhase("prize")}
                >
                  ← Back to your prize
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
