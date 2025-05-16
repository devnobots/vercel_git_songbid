"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function DebugVimeoCredentials() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkCredentials = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/test-vimeo/debug", {
        method: "GET",
      })

      const data = await response.json()
      setResult(data)

      if (!response.ok) {
        setError(data.error || "Unknown error")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Vimeo Credentials Debug</h1>

        <Button onClick={checkCredentials} disabled={loading} className="mb-4">
          {loading ? "Checking..." : "Check Vimeo Credentials"}
        </Button>

        {error && <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

        {result && (
          <div className="mt-4">
            <h2 className="font-medium mb-2">Results:</h2>
            <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}

        <div className="mt-6">
          <h2 className="font-medium mb-2">Troubleshooting Steps:</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Verify that environment variables are correctly set (which you've confirmed)</li>
            <li>Try redeploying your application to ensure the latest environment variables are used</li>
            <li>Check if your Vimeo access token has the necessary permissions</li>
            <li>Verify that your Vimeo account has upload capabilities</li>
            <li>Check for any rate limiting or quota issues with your Vimeo account</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
