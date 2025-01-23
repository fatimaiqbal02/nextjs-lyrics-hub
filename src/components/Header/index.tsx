"use client"
import { FaFire, FaUserPlus } from "react-icons/fa6";
import { FaUserShield } from "react-icons/fa";
import './header.css'
import Link from "next/link";
import { useState, useEffect } from 'react'
import SearchBar from "../SearchBar";
import { redirect, usePathname } from 'next/navigation'

export default function Header() {

    const pathname = usePathname()
    const [shouldShowTitle, setShouldShowTitle] = useState(false);

    const refreshPage = () => {
        window.location.reload();
    };

    const searchBoxStyle = {
        visibility: pathname == '/' ? 'hidden' : 'visible',
    };

    const [isoptionOpen, setIsoptionOpen] = useState(false);
    const [data, setData] = useState<any>({});

    const toggleoption = () => {
        setIsoptionOpen((prevState) => !prevState);
    };

    const handleLogOut = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/logout`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                }
            });
            refreshPage();
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/User`);
                    const data = await response.json();
                    setData(data.data);   
                    /* console.log(data.data);  */
                } catch (error) {
                    console.error("Internal Server Error:", error);
                }
            };

        fetchData();

        setShouldShowTitle((window.innerWidth > 768 || pathname === '/'));

        const handleResize = () => {
            setShouldShowTitle((window.innerWidth > 768 || pathname === '/'));
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, [pathname]);

    return (
        <header className="header">
            <nav className="navbar">
                {shouldShowTitle ? <Link href={"/"} className="nav__title">Lyrics Hub</Link> : null}

                <SearchBar style={searchBoxStyle} id={1} />

                <div className="nav__left-btns">
                    <Link href={'/popular'} className="popular-link">
                        <i><FaFire /></i>
                        <span>Popular</span>
                        <div className="title">Popular</div>
                    </Link>
                    <div className="tooltip-container">
                        {data && data._id ? (
                            <>
                                <i id="user-icon" className="tooltip-icon" onClick={toggleoption}><FaUserShield /></i>
                                <div className="tooltip-title">
                                    Hello, {data.name}
                                </div>
                            </>
                        ) : (
                            <>
                                <i id="user-icon" className="tooltip-icon" onClick={toggleoption}><FaUserPlus /></i>
                                <div className="tooltip-title">
                                    Login or Sign Up
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className={`user-icon-options ${isoptionOpen ? 'active' : ''}`}>
                    {data && data._id ? (
                        <>
                            <Link href={'/'} className="optbtn" id="login-option" onClick={handleLogOut}>
                                <i><FaUserShield /></i> Log Out
                            </Link>
                            <Link href={'/changePassword'} className="optbtn" id="change-password-option">
                                <i style={{ display: 'inline-block', verticalAlign: 'sub' }} onClick={toggleoption}
                                ><FaUserShield /></i> Change Password
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href={'/login'} className="optbtn" id="login-option" onClick={toggleoption}>
                                <i><FaUserPlus /></i> Log In
                            </Link>
                            <Link href={'/signup'} className="optbtn" id="signin-option" onClick={toggleoption}>
                                <i><FaUserPlus /></i> Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    )
}