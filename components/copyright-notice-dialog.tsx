"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface CopyrightNoticeDialogProps {
  onClose: () => void
}

export default function CopyrightNoticeDialog({ onClose }: CopyrightNoticeDialogProps) {
  return (
    <div className="p-6 relative">
      {/* Close button */}
      <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700" aria-label="Close">
        <X size={18} />
      </button>

      {/* Title - reduced margin bottom from 6 (24px) to 3 (12px) */}
      <h2 className="text-center text-2xl font-semibold mb-3">Important Notice</h2>

      {/* Notice text in light gray box */}
      <div className="bg-gray-50 rounded-lg p-5 mb-6">
        <p className="text-center text-gray-800">
          Please note that the songs featured are used solely to illustrate this concept. No copyright infringement is
          intended, and we deeply admire these artists and their work!
        </p>
      </div>

      {/* Got It button */}
      <Button onClick={onClose} className="w-full py-5 bg-green-600 hover:bg-green-700 text-white text-lg font-medium">
        Got It
      </Button>
    </div>
  )
}
