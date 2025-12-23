import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { JunkAnalyzer } from "./JunkAnalyzer";
import { Sparkles } from "lucide-react";

interface JunkAnalyzerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JunkAnalyzerModal({ open, onOpenChange }: JunkAnalyzerModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Junk Estimator
          </DialogTitle>
          <DialogDescription>
            Snap a photo of your junk and our AI will estimate the removal cost. It's like magic, but for garbage.
          </DialogDescription>
        </DialogHeader>
        <JunkAnalyzer variant="compact" />
      </DialogContent>
    </Dialog>
  );
}
