'use client';
import Bank from "@/components/shared/Bank";
import NotConnected from "@/components/shared/NotConnected";
import { useAccount } from "wagmi";

export default function Home() {

  const { isConnected } = useAccount();

  return (
    <div>
      {isConnected ? (
        <Bank />
      ) : (
        <NotConnected />
      )}
    </div>
  );
}
