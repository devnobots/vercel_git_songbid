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
        <DialogTitle className="text-xl text-[#8b7355]">Human Content Guidelines</DialogTitle>
      </DialogHeader>

      <div className="mt-2 px-4">
        <div className="bg-[#ede5d8] border border-[#8b7355] rounded-lg p-3 shadow-sm">
          <div className="space-y-3">
            <div className="text-center">
              <h3 className="font-semibold text-base mb-1 text-[#8b7355] font-elegant-typewriter">
                Original Acoustic Music
              </h3>
              <p className="text-[#6b5a47] text-sm max-w-[280px] mx-auto font-elegant-typewriter">
                Please submit a simple, live performance of your original song featuring just you and an acoustic
                guitar, another stringed instrument, piano, or presented acapella. No polished music videos, please!
              </p>
            </div>

            <div className="text-center">
              <h3 className="font-semibold text-base mb-1 text-[#8b7355] font-elegant-typewriter">
                Acapella Visibility
              </h3>
              <p className="text-[#6b5a47] text-sm max-w-[280px] mx-auto font-elegant-typewriter">
                If your performance is acapella, your face must be clearly visible throughout the entire video.
              </p>
            </div>

            <div className="text-center">
              <h3 className="font-semibold text-base mb-1 text-[#8b7355] font-elegant-typewriter">
                Human Performance (No AI)
              </h3>
              <p className="text-[#6b5a47] text-sm max-w-[280px] mx-auto font-elegant-typewriter">
                Submissions must be authentic human performances. Video verification is required to ensure this, though
                a face is not required for non-a cappella submissions.
              </p>
            </div>

            <div className="text-center">
              <h3 className="font-semibold text-base mb-1 text-[#8b7355] font-elegant-typewriter">
                Adult Artists Only
              </h3>
              <p className="text-[#6b5a47] text-sm max-w-[280px] mx-auto font-elegant-typewriter">
                You must be 18 years of age or older to upload content.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-3 px-4 pb-2">
        <Button onClick={onAccept} className="w-full py-3 bg-[#f5f1e8] text-[#8b7355] hover:bg-[#ede5d8] rounded-full">
          I Understand and Accept
        </Button>

        <Button
          onClick={onClose}
          className="w-full bg-[#8b7355] text-[#f5f1e8] hover:bg-[#6b5a47] py-3 rounded-full"
          variant="secondary"
        >
          No Thanks
        </Button>
      </div>
    </>
  )
}
