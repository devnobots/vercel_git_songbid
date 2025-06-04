"use client"

import { Button } from "@/components/ui/button"

interface CopyrightNoticeDialogProps {
  onClose: () => void
}

export default function CopyrightNoticeDialog({ onClose }: CopyrightNoticeDialogProps) {
  return (
    <div className="p-6 relative bg-[#f5f1e8]">
      {/* Title - changed from "Important Notice" to "Regarding Song Examples" */}
      <h2 className="text-center text-2xl font-semibold mb-2 font-elegant-typewriter text-[#8b7355]">
        Regarding Song Examples
      </h2>

      {/* Notice text in light gray box */}
      <div className="bg-[#ede5d8] rounded-lg p-5 mb-6">
        <p className="text-center font-elegant-typewriter text-[#6b5a47]">
          We're using these songs to illustrate a concept, and all but Dylan's are covers. No copyright infringement is
          intended; we truly admire these artists and their work.
        </p>
      </div>

      {/* Got It button */}
      <Button
        onClick={onClose}
        className="w-full py-5 bg-[#f5f1e8] hover:bg-[#ede5d8] text-[#8b7355] text-lg font-medium font-elegant-typewriter border border-[#8b7355] rounded-full"
      >
        Got It
      </Button>
    </div>
  )
}
