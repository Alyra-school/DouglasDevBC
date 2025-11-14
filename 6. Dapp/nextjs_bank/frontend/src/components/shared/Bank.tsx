'use client';
import Balance from "./Balance"
import Deposit from "./Deposit"
import Withdraw from "./Withdraw"
import Events from "./Events";

import { useState, useEffect } from "react";

import { type BaseError, useReadContract, useAccount } from 'wagmi'

import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/utils/constants"

import { parseAbiItem } from "viem";
import { publicClient } from "@/utils/client";

import { BankEvent } from "@/types";

const Bank = () => {

    const { address } = useAccount();

    const [loadingEvents, setLoadingEvents] = useState(false);
    const [events, setEvents] = useState<BankEvent[]>([]);

    const { data: balance, error, isPending, refetch } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getBalanceOfUser',
        args: [address]
    })

    //event etherDeposited(address indexed account, uint256 amount);
    //event etherWithdrawn(address indexed account, uint256 amount);

    const getEvents = async() => {
        setLoadingEvents(true);
        const depositEvents = await publicClient.getLogs({
            address: CONTRACT_ADDRESS,
            event: parseAbiItem('event etherDeposited(address indexed account, uint256 amount)'),
            fromBlock: 0n,
            toBlock: 'latest'
        })
        const withdrawEvents = await publicClient.getLogs({
            address: CONTRACT_ADDRESS,
            event: parseAbiItem('event etherWithdrawn(address indexed account, uint256 amount)'),
            fromBlock: 0n,
            toBlock: 'latest'
        })
        // Combiner les events
        const combinedEvents: BankEvent[] = [
            ...depositEvents.map((event) => ({
                type: 'Deposit' as const,
                account: event.args.account?.toString() || '',
                amount: event.args.amount || 0n,
                blockNumber: Number(event.blockNumber)
            })),
            ...withdrawEvents.map((event) => ({
                type: 'Withdraw' as const,
                account: event.args.account?.toString() || '',
                amount: event.args.amount || 0n,
                blockNumber: Number(event.blockNumber)
            })),
        ]
        const sortedEvents = combinedEvents.sort((a,b) => b.blockNumber - a.blockNumber);
        setEvents(sortedEvents);
        setLoadingEvents(false);
    }

    if (error)
    return (
      <div>
        Error: {error.message}
      </div>
    )

    useEffect(() => {
        getEvents();
    }, [])

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Tableau de bord</h1>
                <p className="text-muted-foreground">Gérez vos ETH en toute simplicité</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Balance - spans full width on mobile, 1 column on large screens */}
                <div className="lg:col-span-3">
                    <Balance balance={typeof balance === 'bigint' ? balance : 0n} isPending={isPending} />
                </div>

                {/* Deposit and Withdraw side by side on larger screens */}
                <div className="lg:col-span-1">
                    <Deposit refetch={refetch} getEvents={getEvents} />
                </div>

                <div className="lg:col-span-1">
                    <Withdraw refetch={refetch} getEvents={getEvents} />
                </div>

                {/* Events - spans remaining space */}
                <div className="lg:col-span-1">
                    <Events events={events} />
                </div>
            </div>
        </div>
    )
}

export default Bank