import { BankEvent } from "@/types";
import { Badge } from "../ui/badge";
import { ArrowDownCircle, ArrowUpCircle, Clock } from "lucide-react";

import { formatEther } from "viem";

const Events = ({ events }: { events: BankEvent[] }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Clock className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Historique des transactions</h3>
          <p className="text-xs text-muted-foreground">
            {events.length} transaction{events.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground text-sm">Aucune transaction pour le moment</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {events.map((event) => (
            <div
              key={crypto.randomUUID()}
              className="flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors border border-border/50"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  event.type === 'Deposit'
                    ? 'bg-green-500/10'
                    : 'bg-red-500/10'
                }`}>
                  {event.type === 'Deposit' ? (
                    <ArrowDownCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <ArrowUpCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant={event.type === 'Deposit' ? 'default' : 'secondary'}
                      className={`${
                        event.type === 'Deposit'
                          ? 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30'
                          : 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30'
                      } text-xs px-2 py-0`}
                    >
                      {event.type === 'Deposit' ? 'Dépôt' : 'Retrait'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Block #{event.blockNumber}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate font-mono">
                    {event.account}
                  </p>
                </div>
              </div>

              <div className="text-right flex-shrink-0 ml-4">
                <p className={`text-base font-semibold ${
                  event.type === 'Deposit'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {event.type === 'Deposit' ? '+' : '-'}{Number(formatEther(event.amount)).toFixed(4)}
                </p>
                <p className="text-xs text-muted-foreground">ETH</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Events