import Link from 'next/link'
import Image from 'next/image';
import './page.css'
import backgroundPic from '../../public/images/backgroundMain.webp'
import TopPicks from '@/components/TopPicks';
import Session from '@/components/Session';
import SearchBar from '@/components/SearchBar';

export default function Home() {

  return (
    <>
      <main className="homepage-container">
        <div className="container">
          <Image
            className='background-pic'
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={backgroundPic}
            alt="Background Image"
            priority={true}
          />
          <h2>Unveiling</h2>
          <h1>Soulful Depths of Songs</h1>
          <p>We uncover the profound depths of the cherished songs. Explore not only the overall meaning but also dive into the detailed significance of each line. Join us for a one-of-a-kind lyrical journey into the heart of music! </p>
          <SearchBar id={2}/>
        </div>
      </main>
      <Session/>
      <TopPicks />

    </>
  )
}
