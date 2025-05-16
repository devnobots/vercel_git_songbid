"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Logo from "@/components/logo"

export default function TestVimeoPage() {
  const [file, setFile] = useState<File | null>(null)
  const [videoName, setVideoName] = useState("Test Video")
  const [status, setStatus] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const addLog = useCallback((message: string) => {
    setLogs((prev) => [...prev, `${new Date().toISOString().split("T")[1].split(".")[0]} - ${message}`])
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      addLog(`File selected: ${selectedFile.name} (${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)`)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      addLog("No file selected")
      return
    }

    setIsUploading(true)
    setStatus("Starting upload...")
    setUploadProgress(0)
    addLog("Starting upload process")

    try {
      // Create form data for initial request - ONLY SEND METADATA, NOT THE FILE
      const formData = new FormData()
      formData.append("fileName", file.name)
      formData.append("fileSize", file.size.toString())
      formData.append("name", videoName)

      addLog("Requesting upload link from Vimeo")

      // Step 1: Get the upload link from our API
      const response = await fetch("/api/test-vimeo", {
        method: "POST",
        body: formData,
      })

      // Read the response text once
      const responseText = await response.text()

      if (!response.ok) {
        addLog(`Error from server: ${responseText}`)
        throw new Error(`Server error: ${response.status}`)
      }

      // Parse the JSON from the text we already read
      let data
      try {
        data = JSON.parse(responseText)
        addLog(`Server response received: ${JSON.stringify(data).substring(0, 100)}...`)
      } catch (e) {
        addLog(`Error parsing JSON response: ${responseText}`)
        throw new Error("Invalid JSON response from server")
      }

      if (!data.upload_link) {
        addLog(`Error: No upload link in response. Full response: ${JSON.stringify(data)}`)
        throw new Error("No upload link received from server")
      }

      const uploadLink = data.upload_link
      const vimeoId = data.vimeo_id

      addLog(`Received upload link for Vimeo ID: ${vimeoId}`)
      addLog(`Upload link: ${uploadLink.substring(0, 50)}...`)
      addLog("Starting direct upload to Vimeo")

      // Step 2: Upload the file directly to Vimeo using TUS protocol
      const CHUNK_SIZE = 5 * 1024 * 1024 // 5MB chunks
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE)

      addLog(`File will be uploaded in ${totalChunks} chunks of 5MB each`)

      let uploadOffset = 0
      abortControllerRef.current = new AbortController()

      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * CHUNK_SIZE
        const end = Math.min(file.size, start + CHUNK_SIZE)
        const chunk = file.slice(start, end)
        const chunkSize = end - start

        addLog(`Uploading chunk ${chunkIndex + 1}/${totalChunks} (${(chunkSize / (1024 * 1024)).toFixed(2)} MB)`)

        try {
          const uploadChunkResponse = await fetch(uploadLink, {
            method: "PATCH",
            headers: {
              "Tus-Resumable": "1.0.0",
              "Upload-Offset": uploadOffset.toString(),
              "Content-Type": "application/offset+octet-stream",
              "Content-Length": chunkSize.toString(),
            },
            body: chunk,
            signal: abortControllerRef.current.signal,
          })

          // Read the response text only if there's an error
          if (!uploadChunkResponse.ok) {
            const errorText = await uploadChunkResponse.text()
            addLog(`Chunk upload error: ${uploadChunkResponse.status} - ${errorText}`)
            throw new Error(
              `Failed to upload chunk ${chunkIndex + 1}: ${uploadChunkResponse.status} ${uploadChunkResponse.statusText}`,
            )
          }

          // Get the new upload offset from the response headers
          const newOffset = uploadChunkResponse.headers.get("Upload-Offset")
          if (newOffset) {
            uploadOffset = Number.parseInt(newOffset, 10)
            addLog(`New upload offset: ${uploadOffset}`)
          } else {
            uploadOffset += chunkSize
            addLog(`Calculated new offset: ${uploadOffset}`)
          }

          // Update progress
          const progress = Math.round((uploadOffset / file.size) * 100)
          setUploadProgress(progress)
          addLog(`Upload progress: ${progress}%`)
        } catch (chunkError) {
          addLog(`Error uploading chunk: ${chunkError instanceof Error ? chunkError.message : "Unknown error"}`)
          throw chunkError
        }
      }

      addLog("All chunks uploaded successfully")

      // Step 3: Verify the upload is complete
      addLog("Verifying upload completion")
      const verifyResponse = await fetch(uploadLink, {
        method: "HEAD",
        headers: {
          "Tus-Resumable": "1.0.0",
        },
      })

      if (!verifyResponse.ok) {
        const verifyStatus = verifyResponse.status
        const verifyStatusText = verifyResponse.statusText
        throw new Error(`Failed to verify upload: ${verifyStatus} ${verifyStatusText}`)
      }

      addLog("Upload verified complete")
      setStatus("Upload successful!")
      setUploadProgress(100)
      setVideoUrl(`https://vimeo.com/${vimeoId}`)
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        setStatus("Upload cancelled")
        addLog("Upload was cancelled")
      } else {
        setStatus(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
        addLog(`Upload error: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    } finally {
      setIsUploading(false)
      abortControllerRef.current = null
    }
  }

  const cancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      addLog("Cancelling upload...")
    }
  }

  const resetForm = () => {
    setFile(null)
    setVideoName("Test Video")
    setStatus("")
    setUploadProgress(0)
    setVideoUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setLogs([])
    addLog("Form reset")
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="text-center mb-6">
        <Logo />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Vimeo Upload Test</h1>
          <Link href="/test-vimeo/debug" className="text-blue-500 hover:underline">
            Debug Credentials
          </Link>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="video">Video File (Up to 300MB)</Label>
            <Input
              id="video"
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            {file && (
              <p className="text-sm text-gray-500 mt-1">
                Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="videoName">Video Name</Label>
            <Input
              id="videoName"
              value={videoName}
              onChange={(e) => setVideoName(e.target.value)}
              disabled={isUploading}
            />
          </div>

          <div className="flex gap-4">
            <Button onClick={handleUpload} disabled={isUploading || !file} className="flex-1">
              {isUploading ? "Uploading..." : "Upload to Vimeo"}
            </Button>

            {isUploading ? (
              <Button variant="destructive" onClick={cancelUpload}>
                Cancel
              </Button>
            ) : (
              <Button variant="outline" onClick={resetForm}>
                Reset
              </Button>
            )}
          </div>
        </div>

        {status && (
          <div
            className={`p-4 rounded-md mb-4 ${status.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
          >
            {status}
          </div>
        )}

        {isUploading && (
          <div className="space-y-2 mb-4">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-center">{uploadProgress}% uploaded</p>
          </div>
        )}

        {videoUrl && (
          <div className="mb-4">
            <p className="font-medium mb-2">Video URL:</p>
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline break-all"
            >
              {videoUrl}
            </a>
          </div>
        )}

        <div>
          <h2 className="font-medium mb-2">Logs:</h2>
          <div className="bg-gray-100 p-3 rounded-md h-60 overflow-y-auto text-sm font-mono">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No logs yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
