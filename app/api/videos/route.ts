import { NextResponse } from "next/server"

// Updated videos with the new URLs and information
const sampleVideos = [
  {
    // Video 1
    vimeo_id: "blob_video",
    original_filename: "Tangeld Up In AI Slop!",
    timestamped_filename: "Tangeld_Up_In_AI_Slop_1683657890.mp4",
    upload_timestamp: "2023-05-09T14:31:30Z",
    artist_name: "Zimmer Quarry Man",
    song_title: "Tangeld Up In AI Slop!",
    blob_url: "https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/dylan_new-1-al3YAXx4Q0yfR3N1AYmL8jmjyiofYi.mp4",
  },
  {
    // Video 2
    vimeo_id: "blob_video",
    original_filename: "River",
    timestamped_filename: "River_1683657891.mp4",
    upload_timestamp: "2023-05-10T10:15:22Z",
    artist_name: "Sierra Eagleson",
    song_title: "River",
    blob_url: "https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/river_new_22-ITlUuJptmAaHyy1Ky41cJZ8wQj8XIr.mp4",
  },
  {
    // Video 3
    vimeo_id: "blob_video",
    original_filename: "Mama Tain't Long Before Day",
    timestamped_filename: "Mama_Taint_Long_Before_Day_1683657894.mp4",
    upload_timestamp: "2023-05-13T13:10:45Z",
    artist_name: "James Limerick Kerr",
    song_title: "Mama Tain't Long Before Day",
    blob_url: "https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/aint-oPr4xVnZW8lzmdfiTaW4uimKwmefVR.mp4",
  },
]

// Track API calls to reduce logging
const apiCallsCount = {
  count: 0,
  lastLogTime: Date.now(),
}

export async function GET(request: Request) {
  // Only log once every 10 seconds to reduce console spam
  const now = Date.now()
  const shouldLog = now - apiCallsCount.lastLogTime > 10000

  if (shouldLog) {
    console.log(`GET /api/videos - Call count since last log: ${apiCallsCount.count + 1}`)
    apiCallsCount.count = 0
    apiCallsCount.lastLogTime = now
  } else {
    apiCallsCount.count++
  }

  // Get page from query params
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")

  // ALWAYS return the sample videos for page 1, regardless of any other parameters
  if (page === 1) {
    // Only log once every 10 seconds
    if (shouldLog) {
      console.log("Returning sample videos")
    }
    return NextResponse.json(sampleVideos)
  } else {
    // For any other page, return empty array (no more videos)
    // Only log once every 10 seconds
    if (shouldLog) {
      console.log("Returning empty array for page > 1")
    }
    return NextResponse.json([])
  }
}
