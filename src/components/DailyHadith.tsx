import { useState, useMemo } from "react";
import { Quote, Copy, Share2, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { hadiths } from "@/data/hadiths";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

function getDayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

interface DailyHadithProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function DailyHadith({ className, ...props }: DailyHadithProps) {
  const todayIndex = getDayOfYear() % hadiths.length;
  const [index, setIndex] = useState(todayIndex);
  const [copied, setCopied] = useState(false);

  const hadith = useMemo(() => hadiths[index], [index]);

  const prev = () => setIndex((i) => (i - 1 + hadiths.length) % hadiths.length);
  const next = () => setIndex((i) => (i + 1) % hadiths.length);

  const copyToClipboard = async () => {
    const text = `"${hadith.text}"\n\n— ${hadith.narrator}\n📖 ${hadith.source}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({ title: "Copied!", description: "Hadith copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Error", description: "Could not copy to clipboard", variant: "destructive" });
    }
  };

  const share = async () => {
    const text = `"${hadith.text}"\n\n— ${hadith.narrator}\n📖 ${hadith.source}\n\n🌙 Shared via Ramadan Journey`;
    if (navigator.share) {
      try {
        await navigator.share({ text, title: "Hadith of the Day" });
      } catch {}
    } else {
      copyToClipboard();
    }
  };

  return (
    <Card className={cn("border-border/50 shadow-sm flex flex-col", className)} {...props}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg sm:text-xl font-serif flex items-center gap-2">
            <Quote className="w-5 h-5 text-gold" />
            Hadith of the Day
          </CardTitle>
          <span className="text-xs px-2 py-1 bg-gold/10 text-gold rounded-full font-medium">
            {hadith.topic}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="flex flex-col h-full">
          <div className="flex-grow bg-gradient-to-br from-primary/5 to-gold/5 rounded-xl p-3 sm:p-4 md:p-5 border border-border/50 mb-4">
            <p className="text-foreground font-serif text-base md:text-lg leading-relaxed italic">
              "{hadith.text}"
            </p>
            <div className="mt-4 pt-3 border-t border-border/30">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{hadith.narrator}</span>
              </p>
              <p className="text-xs text-gold mt-1">📖 {hadith.source}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={prev} className="h-10 w-10 sm:h-8 sm:w-8 p-0 touch-manipulation active:scale-95">
                <ChevronLeft className="w-5 h-5 sm:w-4 sm:h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={next} className="h-10 w-10 sm:h-8 sm:w-8 p-0 touch-manipulation active:scale-95">
                <ChevronRight className="w-5 h-5 sm:w-4 sm:h-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyToClipboard} className="h-10 sm:h-8 text-xs gap-1.5 px-3 touch-manipulation active:scale-95">
                {copied ? <Check className="w-4 h-4 sm:w-3 sm:h-3" /> : <Copy className="w-4 h-4 sm:w-3 sm:h-3" />}
                <span className="hidden xs:inline">{copied ? "Copied" : "Copy"}</span>
              </Button>
              <Button variant="outline" size="sm" onClick={share} className="h-10 sm:h-8 text-xs gap-1.5 px-3 touch-manipulation active:scale-95">
                <Share2 className="w-4 h-4 sm:w-3 sm:h-3" />
                <span className="hidden xs:inline">Share</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
