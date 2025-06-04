import Link from "next/link"

interface VintageHeaderProps {
  showSubtitle?: boolean
  feedPage?: boolean
}

export default function VintageHeader({ showSubtitle = false, feedPage = false }: VintageHeaderProps) {
  // Calculate height based on whether it's the feed page or not
  // For homepage (not feedPage), make it 10% smaller: 105 * 0.9 = 94.5
  const logoHeight = feedPage ? 105 : 94.5

  return (
    <div className="w-full content-layer">
      <div className="flex flex-col items-center">
        {/* Adjust height based on page type */}
        <div className="relative mb-[30px] sm:mb-0" style={{ height: `${logoHeight}px` }}>
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
