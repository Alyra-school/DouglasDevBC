'use client';
import { useState, useEffect } from "react"
import Link from "next/link";

const JeuPage = () => {

    const [number, setNumber] = useState(0);

    const increment = () => {
        setNumber((prevNumber) => prevNumber + 1);
    }

    useEffect(() => {
        console.log('number a changé :o')
    }, [number])

    useEffect(() => {
        console.log('La page est chargée');
    }, [])

    useEffect(() => {
        console.log('Quelque chose a changé');
    })

    useEffect(() => {
        return () => {
            console.log('Le composant est démonté');
        }
    }, [])

    return (
        <>
            <div>{number}</div>
            <button onClick={increment}>Incrémenter</button>
            <Link href="/">Retourner sur Home</Link>
        </>
    )
}

export default JeuPage