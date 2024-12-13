"use client";

import { useEffect, useState } from "react";

export const DateFormat = ({ date }: { date: Date }) => {
  // Force re-render on mount to update format with current locale
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }
  return (
    <time dateTime={date.toISOString()}>
      {date.toLocaleString()}
    </time>
  );
};
