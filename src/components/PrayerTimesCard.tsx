import { useState, useEffect, useMemo } from "react";
import { Clock, MapPin, Search, Sun, Moon, Sunrise, Sunset } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PrayerTime } from "@/hooks/usePrayerTimes";

const prayerIcons: Record<string, React.ReactNode> = {
  Fajr: <Sunrise className="w-4 h-4" />,
  Dhuhr: <Sun className="w-4 h-4" />,
  Asr: <Sun className="w-4 h-4" />,
  Maghrib: <Sunset className="w-4 h-4" />,
  Isha: <Moon className="w-4 h-4" />,
};

function parseTime(t: string): number {
  const clean = t.replace(/\s*\(.*\)/, "");
  const [h, m] = clean.split(":").map(Number);
  return h * 60 + m;
}

function getNextPrayer(prayers: PrayerTime[], imsak: string) {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Include Imsak and Iftar (Maghrib)
  const allTimes = [
    { name: "Imsak", time: imsak, arabicName: "الإمساك" },
    ...prayers,
  ];

  for (const p of allTimes) {
    if (parseTime(p.time) > currentMinutes) {
      return p.name;
    }
  }
  return allTimes[0].name; // wrap to next day
}

function getCountdownToNext(prayers: PrayerTime[], imsak: string) {
  const next = getNextPrayer(prayers, imsak);
  const allTimes = [{ name: "Imsak", time: imsak, arabicName: "الإمساك" }, ...prayers];
  const target = allTimes.find((p) => p.name === next);
  if (!target) return "";

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  let targetMinutes = parseTime(target.time);
  if (targetMinutes <= currentMinutes) targetMinutes += 24 * 60;

  const diff = targetMinutes - currentMinutes;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return `${h}h ${m}m`;
}

interface Props {
  prayers: PrayerTime[];
  imsak: string;
  city: string;
  loading: boolean;
  error: string | null;
  onSearch: (city: string) => void;
}

export default function PrayerTimesCard({ prayers, imsak, city, loading, error, onSearch }: Props) {
  const [searchVal, setSearchVal] = useState("");
  const [countdown, setCountdown] = useState("");
  const [nextPrayer, setNextPrayer] = useState("");

  useEffect(() => {
    if (prayers.length === 0) return;
    const update = () => {
      setNextPrayer(getNextPrayer(prayers, imsak));
      setCountdown(getCountdownToNext(prayers, imsak));
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, [prayers, imsak]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) onSearch(searchVal.trim());
  };

  const iftarTime = useMemo(() => prayers.find((p) => p.name === "Maghrib")?.time || "", [prayers]);

  return (
    <Card className="border-border/50 shadow-sm h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-serif flex items-center gap-2">
            <Clock className="w-5 h-5 text-gold" />
            Prayer Times
          </CardTitle>
          {city && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {city}
            </span>
          )}
        </div>
        <form onSubmit={handleSearch} className="flex gap-2 mt-2">
          <Input
            placeholder="Search city..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="text-sm h-9"
          />
          <Button type="submit" size="sm" variant="outline" className="h-9 px-3">
            <Search className="w-4 h-4" />
          </Button>
        </form>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        {loading && <p className="text-sm text-muted-foreground text-center py-4">Loading...</p>}
        {error && <p className="text-sm text-destructive text-center py-4">{error}</p>}
        {!loading && !error && prayers.length > 0 && (
          <div className="flex flex-col h-full">
            {/* Next prayer highlight */}
            <div className="bg-primary/10 rounded-lg p-5 mb-4 text-center border border-primary/20">
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Next Prayer</p>
              <p className="text-2xl font-serif font-bold text-foreground">{nextPrayer}</p>
              <p className="text-lg text-gold font-semibold">{countdown}</p>
            </div>

            {/* Imsak & Iftar */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-secondary rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">Imsak</p>
                <p className="font-semibold text-foreground">{imsak.replace(/\s*\(.*\)/, "")}</p>
              </div>
              <div className="bg-secondary rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">Iftar</p>
                <p className="font-semibold text-foreground">{iftarTime.replace(/\s*\(.*\)/, "")}</p>
              </div>
            </div>

            {/* Prayer list */}
            <div className="space-y-1 flex-grow overflow-auto">
              {prayers.map((p) => (
                <div
                  key={p.name}
                  className={`flex items-center justify-between py-3 sm:py-2.5 px-3 rounded-lg transition-colors touch-manipulation ${
                    nextPrayer === p.name
                      ? "bg-gold/10 border border-gold/20"
                      : "active:bg-muted/70 sm:hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={nextPrayer === p.name ? "text-gold" : "text-muted-foreground"}>
                      {prayerIcons[p.name]}
                    </span>
                    <div>
                      <span className="font-medium text-sm text-foreground">{p.name}</span>
                      <span className="text-xs text-muted-foreground ml-2 hidden xs:inline">{p.arabicName}</span>
                    </div>
                  </div>
                  <span className={`font-mono text-sm ${nextPrayer === p.name ? "text-gold font-bold" : "text-foreground"}`}>
                    {p.time.replace(/\s*\(.*\)/, "")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
