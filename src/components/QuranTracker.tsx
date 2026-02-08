import { useState, useEffect } from "react";
import { BookOpen, Check, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const STORAGE_KEY = "ramadan-quran-tracker";
const TOTAL_DAYS = 30;
const JUZ_NAMES = [
  "Alif Lam Mim", "Sayaqul", "Tilka r-Rusul", "Lan Tanaloo", "Wal-Muhsanat",
  "La Yuhibbu-llah", "Wa Idha Sami'u", "Wa law annana", "Qalal Mala'u", "Wa'lamu",
  "Ya'tadhirun", "Wa ma min dabbah", "Wa ma ubarri'u", "Rubama", "Subhanalladhi",
  "Qal alam", "Iqtaraba", "Qad aflaha", "Wa qalal-ladhina", "Amman Khalaq",
  "Utlu ma uhiya", "Wa man yaqnut", "Wa ma liya", "Faman azlamu", "Ilayhi yuraddu",
  "Ha Mim", "Qala fama khatbukum", "Qad sami'a-llahu", "Tabarakalladhi", "Amma"
];

function loadProgress(): boolean[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return new Array(TOTAL_DAYS).fill(false);
}

export default function QuranTracker() {
  const [progress, setProgress] = useState<boolean[]>(loadProgress);
  const [showStrategy, setShowStrategy] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const toggle = (index: number) => {
    setProgress((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const completed = progress.filter(Boolean).length;
  const percentage = Math.round((completed / TOTAL_DAYS) * 100);

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-serif flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-gold" />
            30-Day Quran Roadmap
          </CardTitle>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setShowStrategy(!showStrategy)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Info className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Reading strategy guide</TooltipContent>
          </Tooltip>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>{completed} of {TOTAL_DAYS} Juz completed</span>
            <span className="text-gold font-semibold">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>
      </CardHeader>
      <CardContent>
        {/* Strategy guide */}
        {showStrategy && (
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 mb-4 text-sm text-foreground">
            <h4 className="font-serif font-bold mb-2 text-gold">📖 4 Pages After Every Prayer</h4>
            <p className="text-muted-foreground mb-2">
              Read just 4 pages after each of the 5 daily prayers. That's 20 pages/day = 1 Juz/day = complete Quran in 30 days!
            </p>
            <div className="grid grid-cols-5 gap-2 mt-3">
              {["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map((p) => (
                <div key={p} className="text-center bg-secondary rounded-md py-2">
                  <p className="text-xs font-semibold text-foreground">{p}</p>
                  <p className="text-xs text-muted-foreground">4 pages</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Day grid */}
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-5 lg:grid-cols-6 gap-2">
          {progress.map((done, i) => (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={`relative rounded-lg p-2 text-center transition-all duration-200 border ${
                done
                  ? "bg-primary border-primary text-primary-foreground shadow-sm"
                  : "bg-card border-border hover:border-gold/40 hover:bg-gold/5 text-foreground"
              }`}
            >
              {done && (
                <Check className="absolute top-1 right-1 w-3 h-3" />
              )}
              <p className="text-xs font-semibold">Day {i + 1}</p>
              <p className="text-[10px] opacity-70 leading-tight mt-0.5 truncate">{JUZ_NAMES[i]}</p>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
