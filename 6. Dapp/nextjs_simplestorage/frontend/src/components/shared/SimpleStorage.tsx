'use client';

import Events from "./Events";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

import { type BaseError, useWriteContract, useWaitForTransactionReceipt, useReadContract  } from "wagmi";

import { Alert, AlertDescription } from "../ui/alert";

import { useState, useEffect } from "react";

import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/utils/constants";

import { publicClient } from "@/lib/client";
import { parseAbiItem } from "viem";

import { SimpleStorageEvent } from "@/utils/types";
import { Loader2, Hash, CheckCircle2, AlertCircle } from "lucide-react";
import { error } from "console";

const SimpleStorage = () => {

    const [inputNumber, setInputNumber] = useState('');
    const [events, setEvents] = useState<SimpleStorageEvent[]>([])

    const { data: number, error: errorRead, isPending: isPendingRead, refetch } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getMyNumber',
    })

    const { data: hash, error: errorWrite, isPending: isPendingWrite, writeContract } = useWriteContract()

    const handleChangeNumber = async() => {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'setMyNumber',
            args: [BigInt(inputNumber)],
        })
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

    const getEvents = async() => {
        const numberChangedEvents = await publicClient.getLogs({
            address: CONTRACT_ADDRESS,
            event: parseAbiItem('event NumberChanged(address indexed by, uint256 number)'),
            fromBlock: 9615998n,
            toBlock: 'latest'
        })
        setEvents(numberChangedEvents.map((event) => {
            return {
                by: event.args.by as string,
                number: event.args.number?.toString() || ''
            }
        }))
    }

    useEffect(() => {
        if(isConfirmed) {
            refetch();
            getEvents();
        }
    }, [isConfirmed])

    useEffect(() => {
        getEvents();
    }, [])

    useEffect(() => {
        console.log(errorRead);
        console.log(errorWrite);
    }, [errorRead, errorWrite])

    return (
        <div className="container max-w-4xl mx-auto p-4 md:p-6 space-y-6">
            {/* Current Number Card */}
            <Card className="border-2 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                    <CardTitle className="text-2xl">Nombre stocké</CardTitle>
                    <CardDescription>Consultez la valeur actuelle enregistrée sur la blockchain</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    {isPendingRead ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <p>Chargement...</p>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold shadow-md">
                                {number?.toString()}
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Votre nombre actuel</p>
                                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {number?.toString()}
                                </p>
                            </div>
                        </div>
                    )}
                    {errorRead && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {errorRead.message}
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Update Number Card */}
            <Card className="border-2 shadow-lg">
                <CardHeader>
                    <CardTitle>Modifier le nombre</CardTitle>
                    <CardDescription>Entrez un nouveau nombre à stocker sur la blockchain</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="number-input" className="text-base">Nouveau nombre</Label>
                        <Input
                            id="number-input"
                            type="number"
                            placeholder="Entrez un nombre entier (ex: 42)..."
                            value={inputNumber}
                            onChange={(e) => setInputNumber(e.target.value)}
                            className="h-12 text-lg"
                        />
                    </div>
                    <Button
                        disabled={isPendingWrite || !inputNumber}
                        onClick={handleChangeNumber}
                        className="w-full h-12 text-foreground bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                        {isPendingWrite ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Modification en cours...
                            </>
                        ) : (
                            'Modifier le nombre'
                        )}
                    </Button>

                    {/* Transaction Status */}
                    {hash && (
                        <div className="space-y-3 pt-4 border-t">
                            <div className="flex items-start gap-2 text-sm">
                                <Hash className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-muted-foreground mb-1">Hash de transaction</p>
                                    <p className="font-mono text-xs break-all">{hash}</p>
                                </div>
                            </div>
                            {isConfirming && (
                                <Alert>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <AlertDescription>
                                        En attente de confirmation...
                                    </AlertDescription>
                                </Alert>
                            )}
                            {isConfirmed && (
                                <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    <AlertDescription className="text-green-800 dark:text-green-200">
                                        Transaction confirmée avec succès !
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    )}
                    {errorWrite && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {(errorWrite as BaseError).shortMessage || errorWrite.message}
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Events Card */}
            <Events events={events} />
        </div>
  )
}

export default SimpleStorage