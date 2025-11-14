export interface BankEvent {
    type: 'Deposit' | 'Withdraw';
    account: string;
    amount: bigint;
    blockNumber: number;
}