import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check environment variables (without revealing actual values)
    const accessToken = process.env.VIMEO_ACCESS_TOKEN
    const clientId = process.env.VIMEO_CLIENT_ID
    const clientSecret = process.env.VIMEO_CLIENT_SECRET

    // Test Vimeo API connection
    let vimeoApiStatus = "Not tested"
    let vimeoApiError = null
    let vimeoUserInfo = null

    if (accessToken) {
      try {
        const response = await fetch("https://api.vimeo.com/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Accept: "application/vnd.vimeo.*+json;version=3.4",
          },
        })

        if (response.ok) {
          const data = await response.json()
          vimeoApiStatus = "Connected"
          // Only include non-sensitive account info
          vimeoApiStatus = `Connected as ${data.name || data.uri || "Vimeo User"}`
          vimeoUserInfo = {
            name: data.name,
            uri: data.uri,
            account_type: data.account_type,
            upload_quota: data.upload_quota,
            is_staff: data.is_staff,
          }
        } else {
          const errorText = await response.text()
          vimeoApiStatus = "Error"
          vimeoApiError = `Status ${response.status}: ${errorText}`
        }
      } catch (error) {
        vimeoApiStatus = "Error"
        vimeoApiError = error instanceof Error ? error.message : "Unknown error"
      }
    }

    // Test token scopes
    let tokenScopes = null
    if (accessToken) {
      try {
        const response = await fetch("https://api.vimeo.com/oauth/verify", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Accept: "application/vnd.vimeo.*+json;version=3.4",
          },
        })

        if (response.ok) {
          const data = await response.json()
          tokenScopes = data.scopes
        }
      } catch (error) {
        console.error("Error checking token scopes:", error)
      }
    }

    return NextResponse.json({
      environment: {
        VIMEO_ACCESS_TOKEN: !!accessToken ? "Set" : "Missing",
        VIMEO_CLIENT_ID: !!clientId ? "Set" : "Missing",
        VIMEO_CLIENT_SECRET: !!clientSecret ? "Set" : "Missing",
      },
      vimeoApi: {
        status: vimeoApiStatus,
        error: vimeoApiError,
        userInfo: vimeoUserInfo,
        tokenScopes: tokenScopes,
      },
      serverInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Debug check failed: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 },
    )
  }
}
