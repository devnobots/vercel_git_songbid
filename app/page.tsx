import Link from "next/link"
import { Button } from "@/components/ui/button"
import VideoPreloader from "@/components/video-preloader"
import VintageHeader from "@/components/vintage-header"

export default function Home() {
  return (
    <main className="min-h-screen bg-paper flex flex-col items-center">
      {/* Add the VideoPreloader component to preload videos in the background */}
      <VideoPreloader />

      {/* Logo area - replaced with vintage header */}
      <VintageHeader />

      {/* Content directly on paper background */}
      <div
        className="w-full pt-10 pb-1 flex flex-col px-6 max-w-md mx-auto content-layer"
        style={{ marginTop: "-40px" }}
      >
        {/* Main description - first paragraph now semi-bold */}
        <div className="text-center mb-7">
          <p className="mb-2 text-[18px] font-semibold font-elegantTypewriter" style={{ color: "#2d3748" }}>
            Free from AI fakery!
          </p>
          <p className="text-[15px] font-elegantTypewriter">
            Experience the talent of real musicians performing on acoustic instruments or singing genuine acapella{" "}
            <br />– all verified by video.
          </p>
        </div>

        {/* For Artists section - increased font size by 1px */}
        <div className="flex flex-col items-center text-center mb-6">
          <h3 className="text-[18px] font-semibold mb-2 font-elegantTypewriter" style={{ color: "#2d3748" }}>
            Artists
          </h3>
          <p className="text-[15px] font-elegantTypewriter">
            This is your chance to shine with authentic performances and receive{" "}
            <span className="text-primary font-bold">90%</span> of all bid revenue and direct financial support!
          </p>
        </div>

        {/* For Supporters section - increased font size by 1px */}
        <div className="flex flex-col items-center text-center mb-7">
          <h3 className="text-[18px] font-semibold mb-2 font-elegantTypewriter" style={{ color: "#2d3748" }}>
            Supporters
          </h3>
          <p className="text-[15px] font-elegantTypewriter">
            Your contributions directly fuel these emerging talents, and the top contributors gain prominent recognition
            in the community!
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 mb-4 w-full">
          <Link href="/feed" className="w-full">
            <Button className="w-full bg-[#e84c30] hover:bg-[#e84c30]/90 text-white py-2 text-base h-auto shadow-sm">
              Begin (with music!)
            </Button>
          </Link>
          <Link href="/feed?muted=true" className="w-full">
            <Button className="w-full bg-[#2d3748] hover:bg-[#2d3748]/90 text-white py-2 text-base h-auto shadow-sm">
              Stay Muted
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
