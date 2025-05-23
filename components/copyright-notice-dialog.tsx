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

      {/* Title - changed from "Important Notice" to "Regarding Song Examples" */}
      <h2 className="text-center text-2xl font-semibold mb-2 font-elegantTypewriter">Regarding Song Examples</h2>

      {/* Notice text in light gray box */}
      <div className="bg-gray-50 rounded-lg p-5 mb-6">
        <p className="text-center text-gray-800 font-elegantTypewriter">
          We're using these songs to illustrate a concept, and all but Dylan's are covers. No copyright infringement is
          intended; we truly admire these artists and their work.
        </p>
      </div>

      {/* Got It button */}
      <Button
        onClick={onClose}
        className="w-full py-5 bg-green-600 hover:bg-green-700 text-white text-lg font-medium font-elegantTypewriter"
      >
        Got It
      </Button>
    </div>
  )
}
