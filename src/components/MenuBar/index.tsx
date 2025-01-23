"use client"
import { useState, useEffect } from "react";
import { FaRegLightbulb, FaHeadphonesSimple, FaComments } from "react-icons/fa6";
import { MdOutlineMenuBook } from "react-icons/md";
import Link from "next/link";

export default function MenuBar() {

    const [activeItem, setActiveItem] = useState(0);

    const handleItemClick = (index: any) => {
        setActiveItem(index);
    };

    useEffect(() => {
        handleItemClick(0);
    }, []); 

    return (
        <nav className="menubar">
            <ul>
                <li>
                    <Link href={'#brief'} className={activeItem === 0 ? "active" : ""}
                        onClick={() => handleItemClick(0)} >
                        <span><i className='icon'><FaRegLightbulb /></i></span>
                        <span className="title">Brief</span>
                    </Link>
                </li>
                <li>
                    <Link href={"#meanings"} className={activeItem === 1 ? "active" : ""}
                        onClick={() => handleItemClick(1)}>
                        <span><i className='icon'><MdOutlineMenuBook /></i></span>
                        <span className="title">Meaning</span>
                    </Link>
                </li>
                <li>
                    <Link href={'#lyrics'} className={activeItem === 2 ? "active" : ""}
                        onClick={() => handleItemClick(2)}>
                        <span><i className='icon'><FaHeadphonesSimple /></i></span>
                        <span className="title">Lyrics</span>
                    </Link>
                </li>
                <li>
                    <Link href={'#comments'} className={activeItem === 3 ? "active" : ""}
                        onClick={() => handleItemClick(3)}>
                        <span><i className='icon'><FaComments /></i></span>
                        <span className="title">Comments</span>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}