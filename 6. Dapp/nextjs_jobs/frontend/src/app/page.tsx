'use client';
import NotConnected from "@/components/NotConnected";
import Jobs from "@/components/Jobs";

import { useAccount } from "wagmi";

export default function Home() {

  const { isConnected } = useAccount();
  return (
    <div>
      {isConnected ? (
        <Jobs />
      ) : (
        <NotConnected />
      )}
    </div>
  );
}
