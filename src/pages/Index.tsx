import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import HeroSection from "@/components/HeroSection";
import PrayerTimesCard from "@/components/PrayerTimesCard";
import QuranTracker from "@/components/QuranTracker";
import DailyHadith from "@/components/DailyHadith";
import { Seo } from "@/components/Seo";

const DARK_MODE_KEY = "ramadan-dark-mode";
function loadDarkMode(): boolean {
  try {
    const stored = localStorage.getItem(DARK_MODE_KEY);
    if (stored !== null) return JSON.parse(stored);
  } catch {}
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
export default function Index() {
  const [citySearch, setCitySearch] = useState<string | undefined>();
  const [darkMode, setDarkMode] = useState(() => {
    const isDark = loadDarkMode();
    if (isDark) document.documentElement.classList.add("dark");
    return isDark;
  });
  const { prayers, imsak, date, loading, error, city, fetchByCity } = usePrayerTimes(citySearch);
  useEffect(() => {
    localStorage.setItem(DARK_MODE_KEY, JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);
  const toggleDark = () => setDarkMode(!darkMode);
  const gregorianDate = date
    ? `${date.gregorian.weekday.en}, ${date.gregorian.day} ${date.gregorian.month.en} ${date.gregorian.year}`
    : new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Rayyan - Ramadan Companion",
    "description": "Prepare for Ramadan with Rayyan. Track your 30-day Quran completion plan, view localized prayer times, and stay inspired with a daily Hadith. Everything a Muslim needs for a productive and blessed Ramadan in one simple dashboard.",
    "applicationCategory": "Lifestyle",
    "operatingSystem": "Any",
    "url": "https://rayyan.soluna.my",
    "screenshot": "https://rayyan.soluna.my/og_image.png",
    "creator": {
      "@type": "Organization",
      "name": "Soluna",
      "url": "https://soluna.my"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Rayyan - Ramadan Companion"
        description="Prepare for Ramadan with Rayyan. Track your 30-day Quran completion plan, view localized prayer times, and stay inspired with a daily Hadith. Everything a Muslim needs for a productive and blessed Ramadan in one simple dashboard."
        keywords="Ramadan, Quran, Prayer Times, Hadith, Islam, Muslim"
        author="Soluna"
        ogTitle="Rayyan - Ramadan Companion"
        ogDescription="Prepare for Ramadan with Rayyan. Track your 30-day Quran completion plan, view localized prayer times, and stay inspired with a daily Hadith. Everything a Muslim needs for a productive and blessed Ramadan in one simple dashboard."
        ogType="website"
        ogImage="https://rayyan.soluna.my/og_image.png"
        twitterCard="summary_large_image"
        twitterSite="@SolunaMY"
        twitterImage="https://rayyan.soluna.my/og_image.png"
        canonical="https://rayyan.soluna.my"
        structuredData={structuredData}
      />
      
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="container max-w-5xl flex items-center justify-between py-3">
          <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
            <span className="text-gold">☪</span> Rayyan - Ramadan Companion
          </h2>
          <Button variant="ghost" size="sm" onClick={toggleDark} className="h-8 w-8 p-0" aria-label="Toggle dark mode">
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      <main className="container max-w-7xl py-6">
        {/* Default layout for mobile and lg */}
        <div className="2xl:hidden">
          <div className="mb-6">
            <HeroSection hijriDate={date?.hijri || null} gregorianDate={gregorianDate} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 flex flex-col gap-6">
              <PrayerTimesCard
                prayers={prayers}
                imsak={imsak}
                city={city}
                loading={loading}
                error={error}
                onSearch={(c) => setCitySearch(c)}
              />
              <DailyHadith />
            </div>
            <div className="lg:col-span-2">
              <QuranTracker />
            </div>
          </div>
        </div>

        {/* 2xl layout */}
        <div className="hidden 2xl:grid 2xl:grid-cols-3 2xl:gap-6">
          <div className="col-span-2 flex flex-col gap-6">
            <HeroSection hijriDate={date?.hijri || null} gregorianDate={gregorianDate} />
            <QuranTracker className="flex-grow" />
          </div>
          <div className="col-span-1 flex flex-col gap-6">
            <PrayerTimesCard
              prayers={prayers}
              imsak={imsak}
              city={city}
              loading={loading}
              error={error}
              onSearch={(c) => setCitySearch(c)}
            />
            <DailyHadith className="flex-grow" />
          </div>
        </div>
      </main>

      <footer className="border-t border-border/50 py-6 mt-12">
        <div className="container max-w-5xl text-center text-xs text-muted-foreground">
          <p className="font-serif text-sm text-gold mb-1">رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّMِيعُ الْعَلِيمُ</p>
          <p>"Our Lord, accept from us. Indeed You are the Hearing, the Knowing."</p>
          <p className="mt-2">Built from Soluna for the Muslim Ummah</p>
        </div>
      </footer>
    </div>
  );
}
