import { useState } from "react";
// 1. Make sure you import the button from the correct path
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

export const CopyButton = ({ text }: { text: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    // 2. This Button is now the ref-forwarding one from shadcn/ui
    <Button
      onClick={handleCopy}
      variant="ghost"
      size="icon"
      className="h-6 w-6"
    >
      {isCopied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
};
