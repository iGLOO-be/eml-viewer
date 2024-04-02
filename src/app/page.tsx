'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <form
      className="flex flex-col items-center justify-center h-screen"
      onSubmit={(e) => {
        e.preventDefault();
        const url = (e.target as any).url.value;
        router.push(`/viewer/${encodeURIComponent(url)}`);
      }}
    >
      <div className="w-80">
        <Input type="text" name="url" required />
        <Button type="submit" variant="outline" className="mt-4 w-full">
          Submit
        </Button>
      </div>
    </form>
  );
}
