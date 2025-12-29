import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check, Share2, RotateCcw, Gift, MessageCircle, Mail, Facebook, Twitter } from "lucide-react";
import { JunkBingoCard } from "./JunkBingoCard";
import { useToast } from "@/hooks";
import {
  cn,
  type BingoCard,
  generateBingoCard,
  saveBingoState,
  loadBingoState,
  clearBingoState,
  getLineCount,
  getCurrentTier,
  isBlackout,
  generateBingoCode,
  getCheckedCount,
} from "@/lib";

interface JunkBingoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Phase = "play" | "results";

export function JunkBingoModal({ open, onOpenChange }: JunkBingoModalProps) {
  const [phase, setPhase] = useState<Phase>("play");
  const [card, setCard] = useState<BingoCard | null>(null);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastCelebratedLines, setLastCelebratedLines] = useState(0);
  const { toast } = useToast();

  // Load or generate card on mount
  useEffect(() => {
    if (open) {
      const saved = loadBingoState();
      if (saved) {
        setCard(saved.card);
        setDiscountCode(saved.discountCode || null);
        const lineCount = getLineCount(saved.card.checked);
        setLastCelebratedLines(lineCount);
        if (saved.discountCode) {
          setPhase("results");
        }
      } else {
        const newCard = generateBingoCard();
        setCard(newCard);
        saveBingoState(newCard);
        setPhase("play");
      }
    }
  }, [open]);

  const handleCheck = (index: number) => {
    if (!card) return;
    
    const newChecked = [...card.checked];
    newChecked[index] = !newChecked[index];
    
    const newCard = { ...card, checked: newChecked };
    setCard(newCard);
    saveBingoState(newCard, discountCode || undefined);
  };

  const handleLineComplete = (lineCount: number) => {
    if (lineCount > lastCelebratedLines) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      
      const tier = getCurrentTier(lineCount);
      if (tier) {
        toast({
          title: `🎉 ${tier.title}!`,
          description: `You unlocked ${tier.discount} off!`,
        });
      }
      
      setLastCelebratedLines(lineCount);
    }
  };

  const handleClaimDiscount = () => {
    if (!card) return;
    
    const lineCount = getLineCount(card.checked);
    const tier = getCurrentTier(lineCount);
    
    if (tier) {
      const code = generateBingoCode(tier);
      setDiscountCode(code);
      saveBingoState(card, code);
      setPhase("results");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handleNewCard = () => {
    clearBingoState();
    const newCard = generateBingoCard();
    setCard(newCard);
    setDiscountCode(null);
    setLastCelebratedLines(0);
    setPhase("play");
    saveBingoState(newCard);
  };

  const copyCode = () => {
    if (!discountCode) return;
    navigator.clipboard.writeText(discountCode);
    setCopied(true);
    toast({
      title: "Code copied!",
      description: "Use it when booking your pickup.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = card ? getLineCount(card.checked) : 0;
  const currentTier = getCurrentTier(lineCount);
  const blackout = card ? isBlackout(card.checked) : false;
  const checkedCount = card ? getCheckedCount(card.checked) : 0;

  const shareText = currentTier 
    ? `🎲 I played JUNK BINGO and unlocked ${currentTier.discount} off!\n✅ ${checkedCount} items checked\n🏆 ${lineCount} lines completed\n\nPlay at junkygurus.com/bingo`
    : `🎲 I'm playing JUNK BINGO!\n✅ ${checkedCount} items checked so far\n\nPlay at junkygurus.com/bingo`;

  const shareButtons = [
    {
      name: "Text",
      icon: MessageCircle,
      href: `sms:?body=${encodeURIComponent(shareText)}`,
      color: "bg-brand-sms hover:bg-brand-sms/90",
    },
    {
      name: "Email",
      icon: Mail,
      href: `mailto:?subject=${encodeURIComponent("Check out JUNK BINGO!")}&body=${encodeURIComponent(shareText)}`,
      color: "bg-info hover:bg-info/90",
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(shareText)}`,
      color: "bg-brand-facebook hover:bg-brand-facebook/90",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      color: "bg-brand-twitter hover:bg-brand-twitter/90",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Confetti */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-[confetti_3s_ease-out_forwards]"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: "-10px",
                  animationDelay: `${Math.random() * 0.5}s`,
                  backgroundColor: ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"][Math.floor(Math.random() * 5)],
                  width: `${8 + Math.random() * 8}px`,
                  height: `${8 + Math.random() * 8}px`,
                  borderRadius: Math.random() > 0.5 ? "50%" : "0",
                }}
              />
            ))}
          </div>
        )}

        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            {phase === "play" ? (
              <>🎲 JUNK BINGO</>
            ) : (
              <>🎉 Congrats!</>
            )}
          </DialogTitle>
        </DialogHeader>

        {phase === "play" && card && (
          <div className="space-y-4">
            <p className="text-center text-muted-foreground text-sm">
              Check off items lurking in your garage, basement, or that room we don't talk about.
            </p>

            <JunkBingoCard
              card={card}
              onCheck={handleCheck}
              onLineComplete={handleLineComplete}
            />

            {currentTier && (
              <Button
                onClick={handleClaimDiscount}
                size="lg"
                className="w-full"
              >
                <Gift className="w-4 h-4 mr-2" />
                Claim Your {currentTier.discount} Discount
              </Button>
            )}

            {!currentTier && (
              <p className="text-center text-sm text-muted-foreground">
                Complete a line (row, column, or diagonal) to unlock your first discount!
              </p>
            )}
          </div>
        )}

        {phase === "results" && card && currentTier && discountCode && (
          <div className="space-y-6 text-center">
            <div className={cn(
              "p-6 rounded-xl",
              blackout 
                ? "bg-gradient-to-br from-primary/20 via-primary/10 to-primary/20 border-2 border-primary" 
                : "bg-muted"
            )}>
              <div className="text-4xl mb-2">
                {blackout ? "🏆" : "🎉"}
              </div>
              <h3 className="text-xl font-bold text-primary mb-1">
                {currentTier.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {checkedCount} items checked • {lineCount} lines completed
              </p>

              <div className="bg-background rounded-lg p-4 space-y-2">
                <p className="text-sm text-muted-foreground">Your discount code:</p>
                <div className="flex items-center justify-center gap-2">
                  <code className="text-xl font-mono font-bold text-primary">
                    {discountCode}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyCode}
                    className="shrink-0"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-2xl font-bold text-primary">
                  {currentTier.discount} OFF
                </p>
              </div>
            </div>

            {/* Share section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
                <Share2 className="w-4 h-4" />
                <span>Share your results</span>
              </div>
              <div className="flex justify-center gap-2">
                {shareButtons.map((button) => (
                  <a
                    key={button.name}
                    href={button.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "p-3 rounded-full text-white transition-transform hover:scale-110",
                      button.color
                    )}
                    title={`Share via ${button.name}`}
                  >
                    <button.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={() => onOpenChange(false)} size="lg">
                Book a Pickup
              </Button>
              <Button
                variant="ghost"
                onClick={handleNewCard}
                className="text-muted-foreground"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Start Fresh (New Card)
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
