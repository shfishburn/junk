import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { JunkBingoCard } from "@/components/JunkBingoCard";
import { Copy, Check, Share2, RotateCcw, Gift, MessageCircle, Mail, Facebook, Twitter, Phone, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import {
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
  DISCOUNT_TIERS,
} from "@/lib/bingo-items";

export default function Bingo() {
  const [card, setCard] = useState<BingoCard | null>(null);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastCelebratedLines, setLastCelebratedLines] = useState(0);
  const { toast } = useToast();

  // Load or generate card on mount
  useEffect(() => {
    const saved = loadBingoState();
    if (saved) {
      setCard(saved.card);
      setDiscountCode(saved.discountCode || null);
      setLastCelebratedLines(getLineCount(saved.card.checked));
    } else {
      const newCard = generateBingoCard();
      setCard(newCard);
      saveBingoState(newCard);
    }
  }, []);

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
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      name: "Email",
      icon: Mail,
      href: `mailto:?subject=${encodeURIComponent("Check out JUNK BINGO!")}&body=${encodeURIComponent(shareText)}`,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(shareText)}`,
      color: "bg-[#1877F2] hover:bg-[#166FE5]",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      color: "bg-[#1DA1F2] hover:bg-[#1A8CD8]",
    },
  ];

  return (
    <Layout>
      <SEO
        title="Junk Bingo - Win Discounts"
        description="Play Junk Bingo! Check off household items you need removed and unlock progressive discounts up to 20% off your junk removal service."
        url="/bingo"
      />

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

      <main className="py-12 sm:py-16 lg:py-20">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              🎲 JUNK BINGO
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Think your junk collection is impressive? Prove it. Check off items and unlock discounts!
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main game area */}
            <div className="lg:col-span-2">
              {card && (
                <div className="bg-card rounded-2xl border shadow-lg p-4 sm:p-6">
                  <JunkBingoCard
                    card={card}
                    onCheck={handleCheck}
                    onLineComplete={handleLineComplete}
                  />

                  {/* Action buttons */}
                  <div className="mt-6 space-y-3">
                    {currentTier && !discountCode && (
                      <Button onClick={handleClaimDiscount} size="lg" className="w-full">
                        <Gift className="w-4 h-4 mr-2" />
                        Claim Your {currentTier.discount} Discount
                      </Button>
                    )}

                    {discountCode && (
                      <div className="bg-primary/10 rounded-xl p-4 text-center space-y-2">
                        <p className="text-sm text-muted-foreground">Your discount code:</p>
                        <div className="flex items-center justify-center gap-2">
                          <code className="text-2xl font-mono font-bold text-primary">
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
                        <p className="text-xl font-bold text-primary">
                          {currentTier?.discount} OFF
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button asChild className="flex-1">
                        <Link to="/book">
                          Book Pickup <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                      <Button variant="outline" onClick={handleNewCard}>
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Share section */}
                  {(currentTier || checkedCount > 5) && (
                    <div className="mt-6 pt-6 border-t space-y-3">
                      <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
                        <Share2 className="w-4 h-4" />
                        <span>Share your progress</span>
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
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* How it works */}
              <div className="bg-card rounded-xl border p-5">
                <h2 className="font-bold text-lg mb-4">How It Works</h2>
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</span>
                    <span>Check off items you have that need to go</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</span>
                    <span>Complete lines (rows, columns, or diagonals)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</span>
                    <span>Unlock bigger discounts with more lines!</span>
                  </li>
                </ol>
              </div>

              {/* Discount tiers */}
              <div className="bg-card rounded-xl border p-5">
                <h2 className="font-bold text-lg mb-4">🏆 Discount Tiers</h2>
                <div className="space-y-2">
                  {DISCOUNT_TIERS.map((tier) => (
                    <div
                      key={tier.lines}
                      className={cn(
                        "flex items-center justify-between p-2 rounded-lg transition-colors",
                        lineCount >= tier.lines ? "bg-primary/10" : "bg-muted/50"
                      )}
                    >
                      <div>
                        <p className={cn(
                          "font-medium text-sm",
                          lineCount >= tier.lines && "text-primary"
                        )}>
                          {tier.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{tier.description}</p>
                      </div>
                      <span className={cn(
                        "font-bold",
                        lineCount >= tier.lines ? "text-primary" : "text-muted-foreground"
                      )}>
                        {tier.discount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 p-5 text-center">
                <h3 className="font-bold mb-2">Ready to clear the junk?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We'll haul it all away. Your discount applies automatically!
                </p>
                <Button asChild className="w-full mb-2">
                  <Link to="/book">Book a Pickup</Link>
                </Button>
                <a
                  href="tel:+13606109233"
                  className="inline-flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  (360) 610-9233
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
