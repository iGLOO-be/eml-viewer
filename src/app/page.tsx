"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <form
      className="flex flex-1 items-center justify-center h-screen bg:bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-50"
      onSubmit={(e) => {
        e.preventDefault();
        const url = (e.target as any).url.value;
        router.push(`/viewer/${encodeURIComponent(url)}`);
      }}
    >
      <div className="w-[60%]">
        <Input type="text" name="url" required placeholder="Enter an URL to view an .eml file" />
        <Button type="submit" variant="outline" className="mt-4 w-full">
          Submit
        </Button>
      </div>
    </form>
  );
}
