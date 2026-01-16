"use client";
import { useState, useEffect, useRef } from "react";
import { MapPin, Loader2 } from "lucide-react";

export default function LocationInput({ 
  onLocationSelect, 
  defaultValue 
}: { 
  onLocationSelect: (address: string) => void,
  defaultValue?: string
}) {
  const [query, setQuery] = useState(defaultValue || "");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Debounce logic ke liye ref
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (defaultValue) setQuery(defaultValue);
  }, [defaultValue]);

  const handleSearch = (text: string) => {
    setQuery(text);
    onLocationSelect(text); // User jo type kar raha hai wo bhi save karte raho

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (text.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    // 1 Second wait karo type karne ke baad (Free API ki respect karne ke liye)
    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${text}&limit=5`);
        const data = await res.json();
        setSuggestions(data);
        setShowDropdown(true);
      } catch (err) {
        console.error("Location Error:", err);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  const handleSelect = (place: any) => {
    // Display name ko thoda clean karte hain
    const cleanName = place.display_name.split(',').slice(0, 3).join(',');
    setQuery(cleanName);
    onLocationSelect(cleanName);
    setSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <MapPin size={14} className="absolute left-3 top-3 text-slate-400"/>
        <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => { if(suggestions.length > 0) setShowDropdown(true); }}
            // onBlur thoda delay dete hain taake click register ho sake
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)} 
            className="w-full mt-1 pl-8 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search city (e.g. Lahore)..."
        />
        {loading && <Loader2 size={14} className="absolute right-3 top-3 animate-spin text-slate-400"/>}
      </div>
      
      {/* Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg mt-1 shadow-xl max-h-60 overflow-auto animate-fade-in">
          {suggestions.map((place, index) => (
            <li
              key={index}
              onClick={() => handleSelect(place)}
              className="px-4 py-2 hover:bg-indigo-50 dark:hover:bg-slate-800 cursor-pointer text-sm text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 last:border-0"
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}