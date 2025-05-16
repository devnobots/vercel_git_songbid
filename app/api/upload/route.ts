import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

// Global in-memory storage for uploaded videos (in a real app, this would be a database)
// Export it so it can be accessed by the clear-data endpoint
export const uploadedVideos: any[] = []

// Flag to control whether sample videos are returned when the array is empty
export const showSampleVideos = true // Set to true to enable sample videos

export async function POST(request: NextRequest) {
  console.log("Received upload request - USING LOCAL STORAGE MODE")

  try {
    // Parse the form data
    const formData = await request.formData()
    const fileName = formData.get("fileName") as string
    const fileSize = Number(formData.get("fileSize") as string)
    const artistName = formData.get("artistName") as string
    const songTitle = formData.get("songTitle") as string

    if (!fileName || !fileSize || !artistName || !songTitle) {
      console.error("Missing required fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("File info received:", fileName, fileSize, "bytes")
    console.log("Artist:", artistName)
    console.log("Song Title:", songTitle)

    // Check file size (300MB limit)
    if (fileSize > 300 * 1024 * 1024) {
      console.error("File size exceeds 300MB limit")
      return NextResponse.json({ error: "File size exceeds 300MB limit" }, { status: 400 })
    }

    // BYPASS VIMEO API - Create a mock video ID
    const mockVimeoId = `local_${Date.now()}`

    // Create a timestamp for the filename
    const timestamp = Math.floor(Date.now() / 1000)
    const fileNameParts = fileName.split(".")
    const extension = fileNameParts.pop()
    const baseName = fileNameParts.join(".")
    const timestampedFilename = `${baseName}_${timestamp}.${extension}`

    console.log("Using local storage mode - bypassing Vimeo API")
    console.log("Generated mock ID:", mockVimeoId)

    // Determine which URL to use based on the current number of videos
    // Position 1: dylan.mp4, Position 2: anchors.mp4, Position 3: son_camp_levee.mp4
    let blobUrl
    const position = (uploadedVideos.length + 1) % 3
    if (position === 1) {
      blobUrl = "https://moltenmike.com/videos/dylan.mp4"
    } else if (position === 2) {
      blobUrl = "https://moltenmike.com/videos/anchors.mp4"
    } else {
      blobUrl = "https://moltenmike.com/videos/son_camp_levee.mp4"
    }

    // Create the video metadata
    const uploadedVideoData = {
      vimeo_id: "blob_video", // Using blob video ID
      original_filename: fileName,
      timestamped_filename: timestampedFilename,
      upload_timestamp: new Date().toISOString(),
      artist_name: artistName,
      song_title: songTitle,
      blob_url: blobUrl,
    }

    // Store the video data (in a real app, this would go to a database)
    uploadedVideos.unshift(uploadedVideoData)

    // Revalidate the feed page to show the new video
    revalidatePath("/feed")

    // Return success with the mock data
    return NextResponse.json({
      success: true,
      message: "Video metadata saved successfully (local mode)",
      ...uploadedVideoData,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Upload failed: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 },
    )
  }
}

// Add a GET method to retrieve uploaded videos
export async function GET(request: Request) {
  console.log("GET /api/upload - Current videos:", uploadedVideos.length)

  // Sample videos with the specified 3 videos in order
  const sampleVideos = [
    {
      vimeo_id: "blob_video",
      original_filename: "Acoustic Guitar Solo.mp4",
      timestamped_filename: "Acoustic_Guitar_Solo_1683657890.mp4",
      upload_timestamp: "2023-05-09T14:31:30Z",
      artist_name: "Sarah Johnson",
      song_title: "Autumn Leaves",
      blob_url: "https://moltenmike.com/videos/dylan.mp4",
    },
    {
      vimeo_id: "blob_video",
      original_filename: "Piano Ballad.mp4",
      timestamped_filename: "Piano_Ballad_1683657891.mp4",
      upload_timestamp: "2023-05-10T10:15:22Z",
      artist_name: "Michael Chen",
      song_title: "Midnight Sonata",
      blob_url: "https://moltenmike.com/videos/anchors.mp4",
    },
    {
      vimeo_id: "blob_video",
      original_filename: "Son Camp Levee.mp4",
      timestamped_filename: "Son_Camp_Levee_1683657894.mp4",
      upload_timestamp: "2023-05-13T13:10:45Z",
      artist_name: "Son House",
      song_title: "Camp Levee Moan",
      blob_url: "https://moltenmike.com/videos/son_camp_levee.mp4",
    },
  ]

  // If we have no videos in memory, return sample videos
  if (uploadedVideos.length === 0 && showSampleVideos) {
    console.log("No videos in memory, returning sample videos")
    return NextResponse.json(sampleVideos)
  }

  console.log("Returning actual videos:", uploadedVideos.length)
  // Otherwise, return the actual uploaded videos
  return NextResponse.json(uploadedVideos)
}
