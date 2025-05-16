"use client"

import { Button } from "@/components/ui/button"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface UploadGuidelinesProps {
  onAccept: () => void
  onClose: () => void
}

export default function UploadGuidelines({ onAccept, onClose }: UploadGuidelinesProps) {
  return (
    <>
      <DialogHeader className="text-center pb-1">
        <DialogTitle className="text-xl">Human Content Guidelines</DialogTitle>
      </DialogHeader>

      <div className="mt-2 px-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 shadow-sm">
          <div className="space-y-3">
            <div className="text-center">
              <h3 className="font-semibold text-base mb-1">Original Acoustic Music</h3>
              <p className="text-gray-700 text-sm max-w-[280px] mx-auto">
                For your video, please submit a live performance of your original song featuring acoustic guitar or
                another stringed instrument, piano, or presented acapella.
              </p>
            </div>

            <div className="text-center">
              <h3 className="font-semibold text-base mb-1">Acapella Visibility</h3>
              <p className="text-gray-700 text-sm max-w-[280px] mx-auto">
                If your performance is acapella, your face must be clearly visible throughout the entire video.
              </p>
            </div>

            <div className="text-center">
              <h3 className="font-semibold text-base mb-1">Human Performance (No AI)</h3>
              <p className="text-gray-700 text-sm max-w-[280px] mx-auto">
                All submissions must be authentic human performances. Video verification is required to ensure this.
              </p>
            </div>

            <div className="text-center">
              <h3 className="font-semibold text-base mb-1">Adult Artists Only</h3>
              <p className="text-gray-700 text-sm max-w-[280px] mx-auto">
                You must be 18 years of age or older to upload content.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-3 px-4 pb-2">
        <Button onClick={onAccept} className="w-full py-3 bg-primary hover:bg-primary/90">
          I Understand and Accept
        </Button>

        <Button onClick={onClose} className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3" variant="secondary">
          No Thanks
        </Button>
      </div>
    </>
  )
}
