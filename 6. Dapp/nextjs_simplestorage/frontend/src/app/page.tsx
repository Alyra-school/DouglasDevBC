'use client';
import NotConnected from "@/components/shared/NotConnected";
import SimpleStorage from "@/components/shared/SimpleStorage";
import { useAccount } from "wagmi";

export default function Home() {

  const { isConnected } = useAccount();

  return (
    <div>
      {isConnected ? (
        <SimpleStorage />
      ) : (
        <NotConnected />
      )}
    </div>
  );
}
