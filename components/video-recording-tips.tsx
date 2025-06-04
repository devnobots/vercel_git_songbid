"use client"

import { Button } from "@/components/ui/button"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface VideoRecordingTipsProps {
  onClose: () => void
}

export default function VideoRecordingTips({ onClose }: VideoRecordingTipsProps) {
  return (
    <>
      <DialogHeader className="text-center pb-1 bg-[#f5f1e8]">
        <DialogTitle className="text-xl text-[#8b7355] font-elegant-typewriter">Video Recording Tips</DialogTitle>
      </DialogHeader>

      <div className="mt-2 px-4 bg-[#f5f1e8]">
        <div className="bg-[#ede5d8] border border-[#8b7355] rounded-lg p-3 shadow-sm">
          <div className="space-y-3">
            <div className="text-center">
              <h3 className="font-semibold text-base mb-1 text-[#8b7355] font-elegant-typewriter">Good Lighting</h3>
              <p className="text-gray-700 text-sm max-w-[280px] mx-auto text-[#6b5a47]">
                Record in a well-lit area. Use natural light (avoid direct sun) or soft, diffused indoor lighting on
                your face and instrument.
              </p>
            </div>

            <div className="text-center">
              <h3 className="font-semibold text-base mb-1 text-[#8b7355] font-elegant-typewriter">Clear Audio</h3>
              <p className="text-gray-700 text-sm max-w-[280px] mx-auto text-[#6b5a47]">
                Record in a quiet environment, away from noise sources. Consider an external microphone.
              </p>
            </div>

            <div className="text-center">
              <h3 className="font-semibold text-base mb-1 text-[#8b7355] font-elegant-typewriter">Stable Camera</h3>
              <p className="text-gray-700 text-sm max-w-[280px] mx-auto text-[#6b5a47]">
                Use a tripod or stable surface. Frame your face and instrument clearly in landscape orientation.
              </p>
            </div>

            <div className="text-center">
              <h3 className="font-semibold text-base mb-1 text-[#8b7355] font-elegant-typewriter">Test Recording</h3>
              <p className="text-gray-700 text-sm max-w-[280px] mx-auto text-[#6b5a47]">
                Do a short test to check audio, lighting, and framing before your full recording.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-3 px-4 pb-2 bg-[#f5f1e8]">
        <Button onClick={onClose} className="w-full py-3 bg-[#8b7355] text-[#f5f1e8] hover:bg-[#6b5a47] rounded-full">
          Got It
        </Button>
      </div>
    </>
  )
}
