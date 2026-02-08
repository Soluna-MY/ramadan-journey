import { useState, useMemo } from "react";
import { Quote, Copy, Share2, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { hadiths } from "@/data/hadiths";
import { toast } from "@/hooks/use-toast";

function getDayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default function DailyHadith() {
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
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-serif flex items-center gap-2">
            <Quote className="w-5 h-5 text-gold" />
            Hadith of the Day
          </CardTitle>
          <span className="text-xs px-2 py-1 bg-gold/10 text-gold rounded-full font-medium">
            {hadith.topic}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-gradient-to-br from-primary/5 to-gold/5 rounded-xl p-5 border border-border/50 mb-4">
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
            <Button variant="ghost" size="sm" onClick={prev} className="h-8 w-8 p-0">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={next} className="h-8 w-8 p-0">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyToClipboard} className="h-8 text-xs gap-1">
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button variant="outline" size="sm" onClick={share} className="h-8 text-xs gap-1">
              <Share2 className="w-3 h-3" />
              Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
