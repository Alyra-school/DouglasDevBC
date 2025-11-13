'use client';

import { parseAbiItem } from 'viem'
import { publicClient } from '@/lib/client';

import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/utils/constants';
import { useState, useEffect } from 'react';

import { Button } from './ui/button';

import NoJobs from './NoJobs';

import { type BaseError, useWriteContract, useWaitForTransactionReceipt, useReadContract  } from "wagmi";

import { useAccount } from 'wagmi';

interface JobEvent {
    id: number;
    author: `0x${string}` | undefined;
    description: string | undefined;
    isTaken: boolean;
    isFinished: boolean;
}

const Jobs = () => {

    const [events, setEvents] = useState<JobEvent[]>([])

    const { address } = useAccount();

    const { data: hashTake, error: errorTake, isPending: isPendingTake, writeContract: writeContractTake } = useWriteContract()
    const { data: hashPay, error: errorPay, isPending: isPendingPay, writeContract: writeContractPay } = useWriteContract()

    const getEvents = async () => {
        const getJobAddedLogs = publicClient.getLogs({
        event: parseAbiItem('event jobAdded(address indexed author, string description, uint price, uint id, bool isFinished)'),
        fromBlock: 0n,
        toBlock: 1000n
        });
    
        const getJobTakenLogs = publicClient.getLogs({
        event: parseAbiItem('event jobTaken(address indexed worker, uint id)'),
        fromBlock: 0n,
        toBlock: 1000n
        });
    
        const getJobIsFinishedAndPaidLogs = publicClient.getLogs({
        event: parseAbiItem('event jobIsFinishedAndPaid(address indexed author, address indexed worker, uint id, uint pricePaid)'),
        fromBlock: 0n,
        toBlock: 1000n
        });
    
        const [jobAddedLogs, jobTakenLogs, jobIsFinishedAndPaidLogs] = await Promise.all([
            getJobAddedLogs,
            getJobTakenLogs,
            getJobIsFinishedAndPaidLogs
        ]);

        const jobTakenMap = jobTakenLogs.reduce((map, jobTaken) => {
            const id = Number(jobTaken.args?.id);
            map[id] = true;
            return map;
        }, {} as Record<number, boolean>);

        const jobFinishedMap = jobIsFinishedAndPaidLogs.reduce((map, jobFinished) => {
            const id = Number(jobFinished.args?.id);
            map[id] = true;
            return map;
        }, {} as Record<number, boolean>);

        const allTheJobs = jobAddedLogs.map((jobAdded) => {
            const id = Number(jobAdded.args?.id);
            return {
                id: id,
                author: jobAdded.args.author,
                description: jobAdded.args.description,
                isTaken: jobTakenMap[id] || false,
                isFinished: jobFinishedMap[id] || false
            };
        });

        setEvents(allTheJobs);
    }

    const handleTakeJob = async(id: number) => {
        writeContractTake({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'takeJob',
            args: [id],
        })
    }

    const handlePayJob = async(id: number) => {
        writeContractPay({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'setIsFinishedAndPay',
            args: [id],
        })
    }

    const { isLoading: isConfirmingTake, isSuccess: isConfirmedTake } =
    useWaitForTransactionReceipt({
      hashTake,
    })

    const { isLoading: isConfirmingPay, isSuccess: isConfirmedPay } =
    useWaitForTransactionReceipt({
      hashPay,
    })

    useEffect(() => {
        getEvents();
    }, [])

    useEffect(() => {
        getEvents();
    }, [isConfirmedPay, isConfirmedTake])

    return (
        <div className="container mx-auto px-4 py-8">
            {events.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {events.map((event) => {
                        const isAuthor = address === event.author;
                        const canTake = !isAuthor && !event.isTaken && !event.isFinished;
                        const canPay = isAuthor && event.isTaken && !event.isFinished;

                        return (
                            <div
                                key={event.id}
                                className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col space-y-4 p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                Job #{event.id}
                                            </span>
                                            {event.isFinished && (
                                                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                    Finished
                                                </span>
                                            )}
                                            {!event.isFinished && event.isTaken && (
                                                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                                                    In Progress
                                                </span>
                                            )}
                                            {!event.isFinished && !event.isTaken && (
                                                <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">
                                                    Available
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <p className="text-sm leading-relaxed text-foreground line-clamp-3">
                                            {event.description || 'No description provided'}
                                        </p>
                                    </div>

                                    {/* Author */}
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Posted by</p>
                                        <p className="font-mono text-xs truncate bg-muted px-2 py-1 rounded">
                                            {event.author}
                                        </p>
                                        {isAuthor && (
                                            <span className="text-xs text-primary font-medium">
                                                (You)
                                            </span>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="pt-2">
                                        {event.isFinished ? (
                                            <div className="flex items-center justify-center py-2 text-sm text-muted-foreground">
                                                Job completed and paid
                                            </div>
                                        ) : event.isTaken ? (
                                            canPay ? (
                                                <Button
                                                    onClick={() => handlePayJob(event.id)}
                                                    className="w-full"
                                                    disabled={isPendingPay}
                                                >
                                                    {isPendingPay ? 'Processing...' : 'Mark as Complete & Pay'}
                                                </Button>
                                            ) : (
                                                <div className="flex items-center justify-center py-2 text-sm text-muted-foreground">
                                                    Job taken by worker
                                                </div>
                                            )
                                        ) : (
                                            canTake && (
                                                <Button
                                                    onClick={() => handleTakeJob(event.id)}
                                                    className="w-full"
                                                    disabled={isPendingTake}
                                                    variant="default"
                                                >
                                                    {isPendingTake ? 'Processing...' : 'Take Job'}
                                                </Button>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <NoJobs />
            )}
        </div>
    )
}

export default Jobs