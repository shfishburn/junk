import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Copy, Check, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from "@/hooks";
import {
  generateExitDiscountCode,
  markExitPopupSeen,
  markExitDiscountClaimed,
} from "@/lib";

interface ExitIntentPopupProps {
  open: boolean;
  onClose: () => void;
}

export function ExitIntentPopup({ open, onClose }: ExitIntentPopupProps) {
  const [discountCode, setDiscountCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      const code = generateExitDiscountCode();
      setDiscountCode(code);
      markExitPopupSeen();
      setShowConfetti(true);
      
      // Hide confetti after animation
      const timer = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(discountCode);
      setCopied(true);
      markExitDiscountClaimed(discountCode);
      toast({
        title: 'Code copied!',
        description: 'Use it at checkout for 10% off',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Please copy the code manually',
        variant: 'destructive',
      });
    }
  };

  const handleBookNow = () => {
    markExitDiscountClaimed(discountCode);
    onClose();
    navigate('/book');
  };

  const handleDismiss = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleDismiss}>
      <DialogContent className="sm:max-w-md overflow-hidden">
        {/* Confetti animation */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  backgroundColor: ['#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#8B5CF6'][
                    Math.floor(Math.random() * 5)
                  ],
                  width: '10px',
                  height: '10px',
                  borderRadius: Math.random() > 0.5 ? '50%' : '0',
                }}
              />
            ))}
          </div>
        )}

        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Gift className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-bold">
            Wait! Here's 10% Off 🎉
          </DialogTitle>
          <DialogDescription className="text-base">
            We'd hate to see you go! Use this exclusive discount on your first junk removal.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Discount code display */}
          <div className="relative">
            <div className="flex items-center justify-center gap-3 p-4 bg-primary/5 border-2 border-dashed border-primary/30 rounded-lg">
              <span className="text-2xl font-mono font-bold tracking-wider text-primary">
                {discountCode}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* CTAs */}
          <div className="space-y-3">
            <Button
              onClick={handleBookNow}
              className="w-full text-lg py-6"
              size="lg"
            >
              Book Now & Save 10%
            </Button>
            <Button
              variant="ghost"
              onClick={handleDismiss}
              className="w-full text-muted-foreground"
            >
              No thanks, I'll pay full price
            </Button>
          </div>

          {/* Fine print */}
          <p className="text-xs text-center text-muted-foreground">
            Valid for first-time customers. Cannot be combined with other offers.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
