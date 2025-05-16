import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log("Received test Vimeo upload request")

  try {
    // Parse the form data
    const formData = await request.formData()
    const fileName = formData.get("fileName") as string
    const fileSize = Number(formData.get("fileSize") as string)
    const name = formData.get("name") as string

    if (!fileName || !fileSize || !name) {
      console.error("Missing required fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("File info received:", fileName, fileSize, "bytes")
    console.log("Video name:", name)

    // Get Vimeo credentials
    const accessToken = process.env.VIMEO_ACCESS_TOKEN
    const clientId = process.env.VIMEO_CLIENT_ID
    const clientSecret = process.env.VIMEO_CLIENT_SECRET

    if (!accessToken || !clientId || !clientSecret) {
      console.error("Missing Vimeo credentials")
      return NextResponse.json({ error: "Missing Vimeo credentials" }, { status: 500 })
    }

    // Step 1: Create a new video resource on Vimeo
    console.log("Creating video resource on Vimeo")
    const createResponse = await fetch("https://api.vimeo.com/me/videos", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.vimeo.*+json;version=3.4",
      },
      body: JSON.stringify({
        upload: {
          approach: "tus",
          size: fileSize,
        },
        name,
        description: "Uploaded via SongBid",
        privacy: {
          view: "anybody",
          embed: "public",
          comments: "anybody",
        },
      }),
    })

    // Log the response status
    console.log("Vimeo API response status:", createResponse.status)

    // Read the response text once
    const responseText = await createResponse.text()

    if (!createResponse.ok) {
      console.error("Failed to create Vimeo video resource:", responseText)
      return NextResponse.json(
        { error: `Failed to create Vimeo video: ${responseText}` },
        { status: createResponse.status },
      )
    }

    // Parse the JSON from the text we already read
    let videoData
    try {
      videoData = JSON.parse(responseText)
    } catch (e) {
      console.error("Error parsing Vimeo API response:", responseText)
      return NextResponse.json({ error: "Invalid JSON response from Vimeo API" }, { status: 500 })
    }

    // Check if upload link exists
    if (!videoData.upload || !videoData.upload.upload_link) {
      console.error("No upload link in Vimeo response:", JSON.stringify(videoData))
      return NextResponse.json({ error: "No upload link in Vimeo response" }, { status: 500 })
    }

    const uploadLink = videoData.upload.upload_link
    const vimeoUri = videoData.uri
    const vimeoId = vimeoUri.split("/").pop()

    console.log("Video resource created, upload link obtained")
    console.log("Vimeo URI:", vimeoUri)
    console.log("Vimeo ID:", vimeoId)
    console.log("Upload Link:", uploadLink)

    // Return the upload link and video data to the client
    return NextResponse.json({
      success: true,
      upload_link: uploadLink,
      vimeo_id: vimeoId,
      vimeo_uri: vimeoUri,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Upload failed: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 },
    )
  }
}
