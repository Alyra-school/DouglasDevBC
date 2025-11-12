import { SimpleStorageEvent } from "@/utils/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Activity, User, Hash } from "lucide-react";

const Events = ({ events }: { events: SimpleStorageEvent[] }) => {
    return (
        <Card className="border-2 shadow-lg">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <CardTitle>Historique des événements</CardTitle>
                </div>
                <CardDescription>
                    {events.length > 0
                        ? `${events.length} modification${events.length > 1 ? 's' : ''} enregistrée${events.length > 1 ? 's' : ''}`
                        : "Aucun événement enregistré pour le moment"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {events.length > 0 ? (
                    <div className="space-y-3">
                        {events.slice().reverse().map((event, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 font-semibold">
                                    #{events.length - index}
                                </div>
                                <div className="flex-1 min-w-0 space-y-1">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <User className="h-3.5 w-3.5" />
                                        <span className="font-mono text-xs truncate">{event.by}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Hash className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-lg font-semibold">{event.number}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                            <Activity className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">Aucun événement pour le moment</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Les modifications apparaîtront ici
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default Events