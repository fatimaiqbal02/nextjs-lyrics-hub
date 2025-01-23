"use client"
import { FaMagnifyingGlass } from "react-icons/fa6";
import Link from "next/link";
import { useState} from 'react'
export const runtime = "edge"

export default function SearchBar({ style, id }: any) {

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isActive, setIsActive] = useState(false);

    const handleInputChange = async (event: any) => {
        setIsActive(true);
        const value = event.target.value;
        setSearchTerm(value);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/song/search?title=${value}`);
            const data = await response.json();
            setSearchResults(data.data);

        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    }

    const handleLinkClick = () => {
        setIsActive(!isActive);
        setSearchTerm('');
    };

    return (
        <div className="nav__search-form" style={style} >
            <div className="searchbar">
                <input type="search" id={`search-box-${id}`} placeholder="Search Songs..." name="" value={searchTerm}
                    onChange={handleInputChange} />
                <label htmlFor={`search-box-${id}`}><i><FaMagnifyingGlass /></i></label>
            </div>

            {(isActive && searchTerm && searchResults) && (
                <div className="nav__searchArea">
                    {searchResults.length > 0 ? (
                        searchResults.map((result: any) => (
                            <Link key={result._id} className="song-search-result" href={`/${result.slug}`} onClick={handleLinkClick} >
                                <div className="song-name">{result.title}</div>
                                <div className="song-artist-name">{result.artistName}</div>
                            </Link>
                        ))
                    ) : (
                        <div className="no-results-message">No songs found</div>
                    )}
                </div>
            )}

        </div>
    )
}