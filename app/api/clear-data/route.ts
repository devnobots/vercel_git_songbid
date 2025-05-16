import { NextResponse } from "next/server"
import { uploadedVideos, showSampleVideos } from "../upload/route"
import { revalidatePath } from "next/cache"

export async function POST(request: Request) {
  try {
    // Get the request body to check for options
    let options = { disableSampleVideos: false }

    try {
      const body = await request.json()
      options = { ...options, ...body }
    } catch (e) {
      // If no JSON body is provided, use default options
    }

    // Clear the uploaded videos array
    uploadedVideos.length = 0

    // Optionally disable sample videos
    if (options.disableSampleVideos) {
      showSampleVideos = false
    }

    // Revalidate the feed page to reflect the changes
    revalidatePath("/feed")

    console.log("Data cleared successfully, sample videos " + (options.disableSampleVideos ? "disabled" : "enabled"))

    return NextResponse.json({
      success: true,
      message:
        "All video data has been cleared successfully. " +
        (options.disableSampleVideos ? "Sample videos have been disabled. " : "Sample videos will still appear. ") +
        "You will still need to manually delete the videos from Vimeo.",
      sampleVideosEnabled: !options.disableSampleVideos,
    })
  } catch (error) {
    console.error("Error clearing data:", error)
    return NextResponse.json(
      { error: "Failed to clear data: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 },
    )
  }
}

// Add a GET method to check the current status
export async function GET() {
  return NextResponse.json({
    videoCount: uploadedVideos.length,
    sampleVideosEnabled: showSampleVideos,
    message: "Use POST to clear all video data",
  })
}
