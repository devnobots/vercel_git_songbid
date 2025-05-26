import Link from "next/link"

interface VintageHeaderProps {
  showSubtitle?: boolean
  feedPage?: boolean
}

export default function VintageHeader({ showSubtitle = false, feedPage = false }: VintageHeaderProps) {
  return (
    <div className="w-full content-layer">
      <div className="flex flex-col items-center">
        {/* Use the same dimensions for both home page and feed page */}
        <div className="h-[105px] relative">
          <Link href="/">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SongBid_darker-6JQyDQAgoKWVvaj596RB2zsaeC40kd.png"
              alt="SONGBID"
              className="h-full object-contain"
            />
          </Link>
        </div>
      </div>
    </div>
  )
}
