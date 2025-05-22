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
            src={
              feedPage
                ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_bare-eP4CzwxWTNsMslml5PSKDU0U2KZe1A.png"
                : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_bare_2-FZCPsTrBJ1htCFEVNNjKPW7gdBBWUU.png"
            }
            alt="SONGBID"
            className="h-full object-contain"
          />
        </div>
      </div>
    </div>
  )
}
