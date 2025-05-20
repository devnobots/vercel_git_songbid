interface VintageHeaderProps {
  showSubtitle?: boolean
  feedPage?: boolean
}

export default function VintageHeader({ showSubtitle = false, feedPage = false }: VintageHeaderProps) {
  return (
    <div className="w-full content-layer">
      <div className="flex flex-col items-center">
        <h1 className="text-center text-[3.5rem] font-bold text-[#333333] font-typewriter tracking-wide">
          <span>S</span>
          <span style={{ marginLeft: "-0.03em" }}>O</span>
          <span>NG</span>
          <span>B</span>
          <span style={{ marginLeft: "-0.08em" }}>I</span>
          <span>D</span>
        </h1>
        {showSubtitle && (
          <div className={`text-center ${feedPage ? "mb-1 -mt-[0.875rem]" : "mb-3 -mt-2"}`}>
            <p
              className="inline-block relative font-typewriter"
              style={{
                fontWeight: 500,
                color: "#333333",
                fontSize: "18px", // Changed from 16px to 18px (+2px)
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
            >
              {feedPage ? "DISCOVER ORIGINAL ACOUSTIC MUSIC" : '"DISCOVER ORIGINAL ACOUSTIC MUSIC"'}
              <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-[#333333]"></span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
