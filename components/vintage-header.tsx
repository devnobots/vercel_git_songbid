interface VintageHeaderProps {
  showSubtitle?: boolean
  feedPage?: boolean
}

export default function VintageHeader({ showSubtitle = false, feedPage = false }: VintageHeaderProps) {
  return (
    <div className="w-full content-layer">
      <div className="flex flex-col items-center">
        {/* Use different dimensions based on whether it's the feed page or not */}
        <div className={`${feedPage ? "w-[308px] h-[123px]" : "w-[438px] h-[175px]"} relative`}>
          <img
            src={
              feedPage
                ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/songbid_hand_logo_line_darker-HdO8CNhiQttGt34pCWl3WmeQmf87U9.png"
                : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/songbid_hand_logo_no_line_darker-zzdjKwWvdaPQdd8yma2KUaZuQObwdG.png"
            }
            alt="SONGBID"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Removed the additional horizontal line that was appearing below the logo on the feed page */}
      </div>
    </div>
  )
}
