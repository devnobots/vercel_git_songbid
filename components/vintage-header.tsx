interface VintageHeaderProps {
  showSubtitle?: boolean
  feedPage?: boolean
}

export default function VintageHeader({ showSubtitle = false, feedPage = false }: VintageHeaderProps) {
  return (
    <div className="w-full content-layer">
      <div className="flex flex-col items-center">
        {/* Use different dimensions based on whether it's the feed page or not */}
        <div className={`${feedPage ? "h-[117px]" : "h-[175px]"} relative`}>
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SongBid_darker-6JQyDQAgoKWVvaj596RB2zsaeC40kd.png"
            alt="SONGBID"
            className="h-full object-contain"
          />
        </div>
      </div>
    </div>
  )
}
