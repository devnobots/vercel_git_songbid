import { NextResponse } from "next/server"

// Sample videos for testing - exactly 3 videos in the specified order
const sampleVideos = [
  {
    // Video 1
    vimeo_id: "blob_video",
    original_filename: "Tangeld Up In AI Slop",
    timestamped_filename: "Acoustic_Guitar_Solo_1683657890.mp4",
    upload_timestamp: "2023-05-09T14:31:30Z",
    artist_name: "Zimmer Quarry Man",
    song_title: "Tangeld Up In AI Slop",
    blob_url: "https://moltenmike.com/videos/dylan.mp4",
  },
  {
    // Video 2
    vimeo_id: "blob_video",
    original_filename: "Anchors In The Sun",
    timestamped_filename: "Piano_Ballad_1683657891.mp4",
    upload_timestamp: "2023-05-10T10:15:22Z",
    artist_name: "Aussie",
    song_title: "Anchors In The Sun",
    blob_url: "https://moltenmike.com/videos/anchors.mp4",
  },
  {
    // Video 3
    vimeo_id: "blob_video",
    original_filename: "Old Video Test",
    timestamped_filename: "Son_Camp_Levee_1683657894.mp4",
    upload_timestamp: "2023-05-13T13:10:45Z",
    artist_name: "Son House",
    song_title: "Old Video Test",
    blob_url: "https://moltenmike.com/videos/son_camp_levee.mp4",
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
