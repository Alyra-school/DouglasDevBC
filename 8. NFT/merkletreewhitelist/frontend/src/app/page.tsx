'use client';
import NotConnected from "@/components/shared/NotConnected";
import NFT from "@/components/shared/Mint";
import { useAccount } from "wagmi";

export default function Home() {

  const { isConnected } = useAccount();

  return (
    <div>
      {isConnected ? (
        <NFT />
      ) : (
        <NotConnected />
      )}
    </div>
  );
}