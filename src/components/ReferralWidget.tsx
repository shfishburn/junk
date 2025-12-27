import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check, MessageCircle, Mail, Facebook, Twitter, Gift } from "lucide-react";

interface ReferralWidgetProps {
  referrerName?: string;
  referrerEmail?: string;
  variant?: "full" | "compact";
}

export function ReferralWidget({
  referrerName,
  referrerEmail,
  variant = "full",
}: ReferralWidgetProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Generate a simple referral code based on name or random
  const referralCode = referrerName
    ? `JUNK-${referrerName.toUpperCase().slice(0, 4)}${Math.random().toString(36).slice(2, 5).toUpperCase()}`
    : `JUNK-FRIEND-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  const referralLink = `https://junkygurus.com?ref=${referralCode}`;

  const shareMessage = encodeURIComponent(
    `I just booked with Junky Gurus and they're awesome! Use my code ${referralCode} for 10% off your first junk removal. 🗑️✨`
  );

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: "Link copied!",
      description: "Share it with your friends who need junk gone.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareButtons = [
    {
      icon: MessageCircle,
      label: "Text",
      href: `sms:?body=${shareMessage}`,
      color: "bg-primary hover:bg-primary/90",
    },
    {
      icon: Mail,
      label: "Email",
      href: `mailto:?subject=Get 10% off junk removal!&body=${shareMessage}`,
      color: "bg-secondary hover:bg-secondary/80 text-secondary-foreground",
    },
    {
      icon: Facebook,
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${shareMessage}`,
      color: "bg-[#1877F2] hover:bg-[#166FE5]", // Brand color exception
    },
    {
      icon: Twitter,
      label: "Twitter",
      href: `https://twitter.com/intent/tweet?text=${shareMessage}&url=${encodeURIComponent(referralLink)}`,
      color: "bg-[#1DA1F2] hover:bg-[#1A8CD8]", // Brand color exception
    },
  ];

  if (variant === "compact") {
    return (
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Got friends with junk? They probably do. Send 'em our way!
          </p>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary">
            <Input
              value={referralLink}
              readOnly
              className="text-xs bg-transparent border-0 text-center"
            />
            <Button variant="ghost" size="icon" onClick={copyLink}>
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {shareButtons.map((btn) => (
            <a
              key={btn.label}
              href={btn.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center justify-center p-3 rounded-lg text-primary-foreground transition-colors ${btn.color}`}
            >
              <btn.icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{btn.label}</span>
            </a>
          ))}
        </div>

        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
          <p className="text-xs text-muted-foreground">
            <strong className="text-charcoal">They get:</strong> 10% off their first haul
          </p>
          <p className="text-xs text-muted-foreground">
            <strong className="text-charcoal">You get:</strong> $25 off your next booking
          </p>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Gift className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-charcoal">Junk Karma</h3>
        <p className="text-muted-foreground">
          The more you share, the more you save. It's junk karma.
        </p>
      </div>

      {/* Rewards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border text-center">
          <div className="text-3xl mb-2">🎁</div>
          <h4 className="font-semibold text-charcoal">Your Friend Gets</h4>
          <p className="text-primary font-bold text-lg">10% Off</p>
          <p className="text-xs text-muted-foreground">First booking</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border text-center">
          <div className="text-3xl mb-2">💰</div>
          <h4 className="font-semibold text-charcoal">You Get</h4>
          <p className="text-primary font-bold text-lg">$25 Off</p>
          <p className="text-xs text-muted-foreground">Next booking</p>
        </div>
      </div>

      {/* Referral link */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-charcoal">
          Your referral link:
        </label>
        <div className="flex gap-2">
          <Input
            value={referralLink}
            readOnly
            className="font-mono text-sm"
          />
          <Button onClick={copyLink} variant={copied ? "secondary" : "default"}>
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Share buttons */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-charcoal">
          Share directly:
        </label>
        <div className="grid grid-cols-2 gap-3">
          {shareButtons.map((btn) => (
            <a
              key={btn.label}
              href={btn.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 p-3 rounded-lg text-primary-foreground transition-colors ${btn.color}`}
            >
              <btn.icon className="h-5 w-5" />
              <span className="font-medium">{btn.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Fun copy */}
      <div className="p-4 rounded-lg bg-section-alt border border-border">
        <p className="text-sm text-charcoal-light text-center italic">
          "Got friends with junk? They probably do. Everyone's got that one room, 
          garage, or closet haunted by stuff. Be their hero. Send 'em our way."
        </p>
      </div>
    </div>
  );
}
