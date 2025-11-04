'use client';
import { useState, useEffect } from "react"

interface Stock {
    ticker: string;
    name: string;
}
//https://dumbstockapi.com/stock?exchange=NYSE

const StockPage = () => {

    const [data, setData] = useState<Stock[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async() => {
            try {
                const response = await fetch('https://dumbstockapi.com/stock?exchange=NYSE');
                const stocks: Stock[] = await response.json();
                setData(stocks);
            }
            catch {
                console.error('Erreur');
            }
            finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [])

    return (
        <div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div>
                {data?.map((item) => {
                    return <p key={item.ticker}>{item.ticker} - {item.name}</p>
                })}
                </div>
            )}
        </div>
    )
}

export default StockPage