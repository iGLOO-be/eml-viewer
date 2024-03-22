'use client';

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <form onSubmit={e => {
      e.preventDefault();
      const url = (e.target as any).url.value;
      router.push(`/viewer/${encodeURIComponent(url)}`);
    }}>
      <div>
        <input type="text" name="url" required />
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
}
