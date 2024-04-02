'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const url = (e.target as any).url.value;
        router.push(`/viewer/${encodeURIComponent(url)}`);
      }}
    >
      <div>
        <Input type="text" name="url" required />
      </div>
      <div>
        <Button type="submit" variant="outline">
          Submit
        </Button>
      </div>
    </form>
  );
}
