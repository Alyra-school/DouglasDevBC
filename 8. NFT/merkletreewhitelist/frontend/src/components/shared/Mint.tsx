'use client';
import { useAccount } from "wagmi"
import { useState, useEffect } from "react";
import { whitelisted, contractAddress, contractAbi } from "@/utils/constants";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";

const Mint = () => {

    const { address, isConnected } = useAccount();
    const [merkleProof, setMerkleProof] = useState<string[]>([]);
    const [merkleRootError, setMerkleRootError] = useState('');

    const { data: hash, writeContract } = useWriteContract()

    const mint = async() => {
        writeContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: 'safeMint',
            account: address,
            args: [address, merkleProof]
        })
    }

    const { isLoading, isSuccess } = useWaitForTransactionReceipt({
        hash
    });

    useEffect(() => {
        console.log(merkleRootError);
    }, [merkleRootError])

    useEffect(() => {
        if(isConnected && address) {
            try {
                const tree = StandardMerkleTree.of(whitelisted, ["address"]);
                const racine = tree.root;
                console.log(`Racine de l'arbre de Merkle : ${racine}`)
                const proof = tree.getProof([address]);
                setMerkleProof(proof);
            }
            catch {
                setMerkleRootError('You are not eligible to mint your NFT.');
            } 
        }
    }, [isConnected, address])

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="max-w-md w-full bg-card border border-border rounded-xl shadow-lg p-8">
                {isConnected ? (
                    <div className="space-y-6">
                        {hash && (
                            <div className="p-4 bg-muted rounded-lg break-all">
                                <span className="font-semibold text-card-foreground">Transaction Hash:</span>
                                <span className="text-muted-foreground ml-2">{hash}</span>
                            </div>
                        )}
                        {isLoading && (
                            <div className="flex items-center justify-center p-4 text-primary">
                                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                Waiting for confirmation...
                            </div>
                        )}
                        {isSuccess && (
                            <div className="p-4 bg-accent text-accent-foreground rounded-lg text-center font-medium">
                                Check your wallet, you have received 1 NFT! 🎉
                            </div>
                        )}
                        <div className="text-center text-muted-foreground">
                            Please click on the button below to Mint your NFT.
                            <p className="text-sm mt-1">(Only 1 NFT per address)</p>
                        </div>
                        {merkleRootError ? (
                            <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg text-center font-medium">
                                {merkleRootError}
                            </div>
                        ) : (
                            <button
                                onClick={mint}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                Mint your NFT
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="text-center text-card-foreground font-medium">
                        Please Connect your Wallet to Mint
                    </div>
                )}
            </div>
        </div>
    )
}

export default Mint