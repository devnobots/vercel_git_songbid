"use client"

import { Button } from "@/components/ui/button"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface VideoRecordingTipsProps {
  onClose: () => void
}

export default function VideoRecordingTips({ onClose }: VideoRecordingTipsProps) {
  return (
    <>
      <DialogHeader className="text-center pb-1">
        <DialogTitle className="text-xl">Video Recording Tips</DialogTitle>
      </DialogHeader>

      <div className="mt-2 px-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 shadow-sm">
          <div className="space-y-3">
            <div className="text-center">
              <h3 className="font-semibold text-base mb-1">Good Lighting</h3>
              <p className="text-gray-700 text-sm max-w-[280px] mx-auto">
                Record in a well-lit area. Use natural light (avoid direct sun) or soft, diffused indoor lighting on
                your face and instrument.
              </p>
            </div>

            <div className="text-center">
              <h3 className="font-semibold text-base mb-1">Clear Audio</h3>
              <p className="text-gray-700 text-sm max-w-[280px] mx-auto">
                Record in a quiet environment, away from noise sources. Consider an external microphone.
              </p>
            </div>

            <div className="text-center">
              <h3 className="font-semibold text-base mb-1">Stable Camera</h3>
              <p className="text-gray-700 text-sm max-w-[280px] mx-auto">
                Use a tripod or stable surface. Frame your face and instrument clearly in landscape orientation.
              </p>
            </div>

            <div className="text-center">
              <h3 className="font-semibold text-base mb-1">Test Recording</h3>
              <p className="text-gray-700 text-sm max-w-[280px] mx-auto">
                Do a short test to check audio, lighting, and framing before your full recording.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-3 px-4 pb-2">
        <Button onClick={onClose} className="w-full py-3 bg-green-600 hover:bg-green-700 text-white">
          Got It
        </Button>
      </div>
    </>
  )
}
