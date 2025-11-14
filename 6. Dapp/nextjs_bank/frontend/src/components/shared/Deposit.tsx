'use client';
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { ArrowDownCircle, CheckCircle, Loader2 } from "lucide-react"

import { useState, useEffect } from "react";

import { type BaseError, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/utils/constants";

import { parseEther } from "viem";

const Deposit = ({ refetch, getEvents }: { refetch: () => void, getEvents: () => void }) => {

    const [depositAmount, setDepositAmount] = useState('');

    const { data: hash, error, isPending, writeContract } = useWriteContract()

    const handleDeposit = async() => {
        try {
            writeContract({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: 'deposit',
                value: parseEther(depositAmount)
            })
        }
        catch(e) {
            console.error(e);
        }
        finally {
            setDepositAmount('');
        }
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

    useEffect(() => {
        if(isConfirmed) {
            refetch();
            getEvents();
            toast("Succès", {
                description: "Dépôt effectué avec succès!",
            })
        }
    }, [isConfirmed])

    return (
        <div className="bg-card border border-border rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <ArrowDownCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-foreground">Déposer des ETH</h3>
                    <p className="text-xs text-muted-foreground">Ajoutez des fonds à votre compte</p>
                </div>
            </div>

            {hash && (
                <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Hash de transaction :</p>
                    <p className="text-xs font-mono text-foreground break-all">{hash}</p>
                </div>
            )}

            {isConfirming && (
                <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" />
                    <span className="text-sm text-blue-600 dark:text-blue-400">Confirmation en cours...</span>
                </div>
            )}

            {isConfirmed && (
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-green-600 dark:text-green-400">Transaction confirmée!</span>
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive">{(error as BaseError).shortMessage || error.message}</p>
                </div>
            )}

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="deposit" className="text-sm font-medium">Montant à déposer</Label>
                    <Input
                        id="deposit"
                        type="number"
                        step="0.001"
                        placeholder="0.00"
                        className="h-12 text-lg"
                        onChange={(e) => setDepositAmount(e.target.value)}
                        value={depositAmount}
                    />
                    <p className="text-xs text-muted-foreground">Entrez le montant en ETH</p>
                </div>

                <Button
                    className="w-full h-12 text-base font-semibold bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
                    onClick={handleDeposit}
                    disabled={isPending || !depositAmount || Number(depositAmount) <= 0}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            En cours...
                        </>
                    ) : (
                        <>
                            <ArrowDownCircle className="w-4 h-4 mr-2" />
                            Déposer
                        </>
                    )}
                </Button>
            </div>
        </div>
  )
}

export default Deposit