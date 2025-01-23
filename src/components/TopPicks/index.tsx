"use client"
import './toppicks.css'
import SongInfoBox from '@/components/SongInfoBox'
import { useState, useEffect } from 'react';
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight  } from "react-icons/md";
export const runtime = "edge"

export default function TopPicks() {

  const [selectedCategory, setSelectedCategory] = useState('latest');
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/song/${selectedCategory}?page=${page}`);
      const resdata = await response.json();
      setData(resdata.data);
      setTotalPages(Math.ceil(resdata.total / 15));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory, page]);


  return (
    <section className="top-picks-section">
      <h1 className="heading">Top Picks</h1>
      <p>Discover the pulse of music with our curated selection of trending hits. From the latest releases to timeless favorites, explore the songs making waves in the musical landscape.</p>
      <div className="control-btns">
        <button className={selectedCategory === 'latest' ? 'active' : ''} onClick={() => handleCategoryChange('latest')}>Latest</button>
        <button className={selectedCategory === 'trending' ? 'active' : ''} onClick={() => handleCategoryChange('trending')}>Trending</button>
      </div>
      <div className="top-picks-song-grid">
        <div className="box-container">
          {data.map((item: any) => (
            <SongInfoBox key={item._id} title={item.title} artist={item.artistName}
              views={item.views} likes={item.likes} rating={item.rating}
              lyrics_loved_count={item.lyrics_loved_count} meaning_useful_count={item.meaning_useful_count}
              ratingCount={item.ratings_count} slug={item.slug} />
          ))}
        </div>
        <div className="pagination-buttons">
          <button onClick={handlePrevPage}  disabled={page === 1} className={page === 1 ? 'disabled' : ''}><i><MdKeyboardDoubleArrowLeft/></i></button>
          <button onClick={handleNextPage}  disabled={page === totalPages} className={page === totalPages ? 'disabled' : ''}><i><MdKeyboardDoubleArrowRight/></i></button>
        </div>
      </div>
    </section>
  )
}