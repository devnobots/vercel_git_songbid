import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log("Received upload request")

  try {
    // Parse the form data
    const formData = await request.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string

    if (!file || !title) {
      console.error("Missing file or title")
      return NextResponse.json({ error: "Missing file or title" }, { status: 400 })
    }

    console.log("File received:", file.name, file.size, "bytes")
    console.log("Title:", title)

    // Log the environment variables (without revealing actual values)
    console.log("VIMEO_ACCESS_TOKEN exists:", !!process.env.VIMEO_ACCESS_TOKEN)
    console.log("VIMEO_CLIENT_ID exists:", !!process.env.VIMEO_CLIENT_ID)
    console.log("VIMEO_CLIENT_SECRET exists:", !!process.env.VIMEO_CLIENT_SECRET)

    // For testing, we'll just simulate a successful upload
    // This helps isolate if the issue is with the form/frontend or with the Vimeo API
    return NextResponse.json({
      success: true,
      message: `Test upload successful for "${file.name}" (${(file.size / (1024 * 1024)).toFixed(2)} MB)`,
      title: title,
      timestamp: new Date().toISOString(),
    })

    /* 
    // Uncomment this section to test with actual Vimeo API
    // Only after the simple test above works correctly
    
    // Get Vimeo credentials
    const accessToken = process.env.VIMEO_ACCESS_TOKEN
    const clientId = process.env.VIMEO_CLIENT_ID
    const clientSecret = process.env.VIMEO_CLIENT_SECRET
    
    if (!accessToken || !clientId || !clientSecret) {
      console.error("Missing Vimeo credentials")
      return NextResponse.json(
        { error: "Server configuration error: Missing Vimeo credentials" },
        { status: 500 }
      )
    }
    
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Upload to Vimeo
    // ... Vimeo API code here ...
    
    return NextResponse.json({
      success: true,
      message: "Upload successful",
      vimeo_id: "test_id",
      title: title
    })
    */
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Upload failed: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 },
    )
  }
}
