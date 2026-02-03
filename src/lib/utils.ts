import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function decodeUrl(url: string) {
  // Because Vercel decode qs
  const decodedUrl = decodeURIComponent(decodeURIComponent(url));
  const qs = new URLSearchParams(decodedUrl.split("?")[1]);
  const finalUrl = `${decodedUrl.split("?")[0]}?${qs
    .toString()
    .replaceAll("+", "%2B")
    .replaceAll(" ", "%20")}`;
  return finalUrl;
}
