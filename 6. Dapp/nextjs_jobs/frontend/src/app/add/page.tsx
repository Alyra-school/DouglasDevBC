"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { type BaseError, useWriteContract, useWaitForTransactionReceipt, useReadContract  } from "wagmi";

import { parseEther } from 'viem'

import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/utils/constants"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { Loader2, Hash, CheckCircle2, AlertCircle } from "lucide-react";

const AddAJob = () => {

    //STATES
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')

    const { data: hash, error: errorWrite, isPending: isPendingWrite, writeContract } = useWriteContract()

    //ROUTER FOR REDIRECTION WITH NEXTJS
    const router = useRouter()

    const handleAddJob = async() => {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'addJob',
            args: [description],
            value: parseEther(price)
        })
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Post a New Job</h1>
                    <p className="text-muted-foreground">
                        Create a job listing on the blockchain. Workers can take your job and get paid upon completion.
                    </p>
                </div>

                {/* Main Card */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="p-6 space-y-6">
                        {/* Form */}
                        <div className="space-y-4">
                            {/* Description Field */}
                            <div className="space-y-2">
                                <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Job Description
                                </label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe the job in detail... What needs to be done? What are the requirements?"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="min-h-[120px] resize-none"
                                    disabled={isPendingWrite || isConfirming}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Provide clear details about the job to attract qualified workers.
                                </p>
                            </div>

                            {/* Price Field */}
                            <div className="space-y-2">
                                <label htmlFor="price" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Payment (ETH)
                                </label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.001"
                                    placeholder="0.1"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    disabled={isPendingWrite || isConfirming}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Amount in ETH that will be paid to the worker upon job completion.
                                </p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            onClick={handleAddJob}
                            className="w-full"
                            size="lg"
                            disabled={isPendingWrite || isConfirming || !description || !price}
                        >
                            {isPendingWrite || isConfirming ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {isPendingWrite ? 'Creating Job...' : 'Confirming...'}
                                </>
                            ) : (
                                'Post Job'
                            )}
                        </Button>

                        {/* Transaction Status */}
                        {hash && (
                            <div className="space-y-3 pt-4 border-t">
                                <div className="flex items-start gap-2 text-sm">
                                    <Hash className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-muted-foreground mb-1">Transaction Hash</p>
                                        <p className="font-mono text-xs break-all bg-muted px-2 py-1 rounded">
                                            {hash}
                                        </p>
                                    </div>
                                </div>
                                {isConfirming && (
                                    <Alert>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <AlertDescription>
                                            Waiting for confirmation...
                                        </AlertDescription>
                                    </Alert>
                                )}
                                {isConfirmed && (
                                    <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        <AlertTitle className="text-green-800 dark:text-green-200">
                                            Success!
                                        </AlertTitle>
                                        <AlertDescription className="text-green-800 dark:text-green-200">
                                            Your job has been posted successfully on the blockchain.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        )}

                        {/* Error Display */}
                        {errorWrite && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    {(errorWrite as BaseError).shortMessage || errorWrite.message}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </div>

                {/* Info Box */}
                <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-muted">
                    <h3 className="text-sm font-medium mb-2">How it works</h3>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Your ETH will be locked in the smart contract</li>
                        <li>Workers can browse and take available jobs</li>
                        <li>Once the job is complete, you can mark it as finished and release payment</li>
                        <li>All transactions are recorded on the blockchain</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default AddAJob