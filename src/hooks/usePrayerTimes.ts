import { useState, useEffect, useCallback } from "react";

export interface PrayerTime {
  name: string;
  time: string;
  arabicName: string;
}

export interface PrayerTimesData {
  prayers: PrayerTime[];
  imsak: string;
  date: {
    hijri: { day: string; month: { en: string; ar: string; number: number }; year: string; weekday: { en: string } };
    gregorian: { date: string; day: string; month: { en: string; number: number }; year: string; weekday: { en: string } };
  } | null;
  loading: boolean;
  error: string | null;
  city: string;
}

export function usePrayerTimes(cityQuery?: string) {
  const [data, setData] = useState<PrayerTimesData>({
    prayers: [],
    imsak: "",
    date: null,
    loading: true,
    error: null,
    city: "",
  });

  const fetchByCity = useCallback(async (city: string) => {
    setData((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();
      const res = await fetch(
        `https://api.aladhan.com/v1/timingsByCity/${dd}-${mm}-${yyyy}?city=${encodeURIComponent(city)}&country=&method=2`
      );
      if (!res.ok) throw new Error("Failed to fetch prayer times");
      const json = await res.json();
      const t = json.data.timings;
      const prayers: PrayerTime[] = [
        { name: "Fajr", time: t.Fajr, arabicName: "الفجر" },
        { name: "Dhuhr", time: t.Dhuhr, arabicName: "الظهر" },
        { name: "Asr", time: t.Asr, arabicName: "العصر" },
        { name: "Maghrib", time: t.Maghrib, arabicName: "المغرب" },
        { name: "Isha", time: t.Isha, arabicName: "العشاء" },
      ];
      setData({
        prayers,
        imsak: t.Imsak,
        date: json.data.date,
        loading: false,
        error: null,
        city,
      });
    } catch (e: any) {
      setData((prev) => ({ ...prev, loading: false, error: e.message }));
    }
  }, []);

  const fetchByCoords = useCallback(async (lat: number, lng: number) => {
    setData((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();
      const res = await fetch(
        `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${lat}&longitude=${lng}&method=2`
      );
      if (!res.ok) throw new Error("Failed to fetch prayer times");
      const json = await res.json();
      const t = json.data.timings;
      const prayers: PrayerTime[] = [
        { name: "Fajr", time: t.Fajr, arabicName: "الفجر" },
        { name: "Dhuhr", time: t.Dhuhr, arabicName: "الظهر" },
        { name: "Asr", time: t.Asr, arabicName: "العصر" },
        { name: "Maghrib", time: t.Maghrib, arabicName: "المغرب" },
        { name: "Isha", time: t.Isha, arabicName: "العشاء" },
      ];
      // Reverse geocode for city name
      let cityName = "Your Location";
      try {
        const geoRes = await fetch(`https://api.aladhan.com/v1/qibla/${lat}/${lng}`);
        cityName = `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`;
      } catch {}
      setData({
        prayers,
        imsak: t.Imsak,
        date: json.data.date,
        loading: false,
        error: null,
        city: cityName,
      });
    } catch (e: any) {
      setData((prev) => ({ ...prev, loading: false, error: e.message }));
    }
  }, []);

  useEffect(() => {
    if (cityQuery) {
      fetchByCity(cityQuery);
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
          () => fetchByCity("Mecca")
        );
      } else {
        fetchByCity("Mecca");
      }
    }
  }, [cityQuery, fetchByCity, fetchByCoords]);

  return { ...data, fetchByCity };
}
