import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import HeroSection from "@/components/HeroSection";
import PrayerTimesCard from "@/components/PrayerTimesCard";
import QuranTracker from "@/components/QuranTracker";
import DailyHadith from "@/components/DailyHadith";

export default function Index() {
  const [citySearch, setCitySearch] = useState<string | undefined>();
  const [darkMode, setDarkMode] = useState(false);
  const { prayers, imsak, date, loading, error, city, fetchByCity } = usePrayerTimes(citySearch);

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const gregorianDate = date
    ? `${date.gregorian.weekday.en}, ${date.gregorian.day} ${date.gregorian.month.en} ${date.gregorian.year}`
    : new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="container max-w-5xl flex items-center justify-between py-3">
          <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
            <span className="text-gold">☪</span> Ramadan Journey
          </h2>
          <Button variant="ghost" size="sm" onClick={toggleDark} className="h-8 w-8 p-0">
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      <main className="container max-w-5xl py-6 space-y-6">
        {/* Hero */}
        <HeroSection hijriDate={date?.hijri || null} gregorianDate={gregorianDate} />

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prayer times - sidebar */}
          <div className="lg:col-span-1">
            <PrayerTimesCard
              prayers={prayers}
              imsak={imsak}
              city={city}
              loading={loading}
              error={error}
              onSearch={(c) => setCitySearch(c)}
            />
          </div>

          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <QuranTracker />
            <DailyHadith />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 mt-12">
        <div className="container max-w-5xl text-center text-xs text-muted-foreground">
          <p className="font-serif text-sm text-gold mb-1">رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ</p>
          <p>"Our Lord, accept from us. Indeed You are the Hearing, the Knowing."</p>
          <p className="mt-2">Built with ❤️ for the Muslim Ummah</p>
        </div>
      </footer>
    </div>
  );
}
