import Link from "next/link";

export const HighlightedText = ({ text, keywords }:any) => {
    const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');
    const parts = text.split(regex);
  
    return (
        <div className="line">
          {parts.map((part:string, index:any) => (
            keywords.includes(part.toLowerCase()) ? (
              <Link key={index} href={`popular/${part}`}>
                {part}
              </Link>
            ) : (
             <span key={index}>{part}</span>
            )
          ))}
        </div>
      );
  };