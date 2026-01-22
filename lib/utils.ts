import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind classes merge karne ke liye standard helper (Optional, agar future me chahiye ho)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 👇 YE HAI TUMHARA SLUG FUNCTION
export const createSlug = (title: string, id: number) => {
  if (!title) return `job-${id}`;
  
  const cleanTitle = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Special chars hatao
    .replace(/\s+/g, '-')         // Spaces ko dash banao
    .replace(/-+/g, '-');         // Multiple dashes ko single karo

  return `${cleanTitle}-${id}`;
};