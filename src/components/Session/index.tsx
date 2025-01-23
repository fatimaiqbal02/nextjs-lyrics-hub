"use client"
import { useEffect } from "react";

export default function Session() {
    const fetchData = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/session`, {
            method: 'POST',
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <></>
    )
}