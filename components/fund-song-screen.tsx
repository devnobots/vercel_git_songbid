"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Check, Lock } from "lucide-react"
import PaymentMethodDialog from "./payment-method-dialog"
import MoneyBreakdownDialog from "./money-breakdown-dialog"
import FeedbackDialog from "./feedback-dialog"

interface FundSongScreenProps {
  isOpen: boolean
  onClose: () => void
  songTitle?: string
  artistName?: string
  isTipMode?: boolean // New prop to determine if this is opened from bio page
}

export default function FundSongScreen({
  isOpen,
  onClose,
  songTitle = "Untitled",
  artistName = "Artist",
  isTipMode = false, // Default to fund mode
}: FundSongScreenProps) {
  const [selectedAmount, setSelectedAmount] = useState(10)
  const [customAmount, setCustomAmount] = useState<string>("10")
  const [showPaymentMethods, setShowPaymentMethods] = useState(false)
  const [showMoneyBreakdown, setShowMoneyBreakdown] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  // Pause all videos when dialog is open
  useEffect(() => {
    if (isOpen) {
      // Pause all HTML5 videos
      const videos = document.querySelectorAll("video")
      videos.forEach((video) => {
        video.pause()
        video.currentTime = 0
      })

      // Handle Vimeo iframes
      const iframes = document.querySelectorAll("iframe")
      iframes.forEach((iframe) => {
        if (iframe.src.includes("vimeo.com")) {
          // Store original src to restore it later if needed
          const originalSrc = iframe.src
          iframe.setAttribute("data-original-src", originalSrc)

          // Replace with empty src or autoplay=0 version
          if (originalSrc.includes("autoplay=1")) {
            iframe.src = originalSrc.replace("autoplay=1", "autoplay=0")
          } else {
            // If no easy way to modify, just remove src temporarily
            iframe.src = ""
          }
        }
      })
    }

    // No cleanup needed as we want videos to stay paused when dialog closes
  }, [isOpen])

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount(amount.toString())
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")
    setCustomAmount(value)
    setSelectedAmount(Number.parseInt(value) || 0)
  }

  const handleSubmit = () => {
    // Show payment method dialog
    setShowPaymentMethods(true)
  }

  const handlePaymentComplete = () => {
    // Handle successful payment
    console.log(`Payment of $${selectedAmount} completed`)
    onClose()
  }

  const handleSupportGoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowMoneyBreakdown(true)
  }

  const handleFeedbackClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowFeedback(true)
  }

  // Determine title and button text based on mode
  const mainTitle = isTipMode ? "Securely Send a Tip" : "Securely Fund"
  const buttonText = isTipMode ? `Tip $${selectedAmount}` : `Fund $${selectedAmount}`

  return (
    <>
      <Dialog open={isOpen && !showPaymentMethods} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md p-0 bg-[#f5f1e8] rounded-xl overflow-hidden border-0 [&>button]:hidden">
          <div className="p-6 pt-4 relative">
            {/* Top icon - Using Lock icon from payment dialog */}
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center">
                <Lock className="h-7 w-7 text-[#8b7355]" />
              </div>
            </div>

            {/* Updated title structure - "Securely Fund" with song title below it */}
            <div className="text-center mb-5">
              <h2 className="text-2xl font-bold font-elegant-typewriter text-[#8b7355]">{mainTitle}</h2>
              {!isTipMode && <p className="text-[#6b5a47] mt-1 font-elegant-typewriter">{songTitle}</p>}
            </div>

            {/* Amount options - Updated with new amounts */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[5, 10, 20, 50, 100, 200].map((amount, index) => (
                <button
                  key={index}
                  onClick={() => handleAmountSelect(amount)}
                  className={`p-3 rounded-lg border font-elegant-typewriter ${
                    selectedAmount === amount
                      ? "bg-[#ede5d8] border-[#8b7355] text-[#8b7355]"
                      : "bg-white border-[#d4c4a8] text-[#6b5a47]"
                  } transition-colors`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">${amount}</span>
                    {selectedAmount === amount && <Check className="w-5 h-5 text-[#8b7355]" />}
                  </div>
                </button>
              ))}
            </div>

            {/* Custom amount input - Fixed for Android */}
            <div className="mb-5">
              <div className="flex items-center border border-[#d4c4a8] rounded-lg p-2 bg-white">
                <span className="text-[#8b7355] text-xl ml-2 flex-shrink-0 font-elegant-typewriter">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  className="flex-1 p-2 text-xl font-bold outline-none w-full bg-transparent font-elegant-typewriter text-[#6b5a47]"
                  placeholder="Other amount"
                  style={{ WebkitAppearance: "none" }}
                />
                <span className="text-[#8b7355] mr-2 flex-shrink-0 font-elegant-typewriter">USD</span>
              </div>
            </div>

            {/* Additional options - Fixed for Android */}
            <div className="space-y-2 mb-5">
              <p className="text-[#6b5a47] flex items-center font-elegant-typewriter">
                <span>Where exactly does your</span>{" "}
                <button
                  onClick={handleSupportGoClick}
                  className="ml-1 text-[#8b7355] underline focus:outline-none font-elegant-typewriter"
                >
                  Support Go?
                </button>
              </p>
              <p className="text-[#6b5a47] font-elegant-typewriter">
                <button
                  onClick={handleFeedbackClick}
                  className="text-[#8b7355] underline focus:outline-none font-elegant-typewriter"
                >
                  Leave us Feedback
                </button>
              </p>
            </div>

            {/* Fund/Tip button */}
            <Button
              onClick={handleSubmit}
              className="w-full py-5 text-xl bg-[#f5f1e8] hover:bg-[#ede5d8] text-[#8b7355] border border-[#8b7355] rounded-full font-elegant-typewriter"
            >
              {buttonText}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Method Dialog */}
      <PaymentMethodDialog
        isOpen={showPaymentMethods}
        onClose={() => setShowPaymentMethods(false)}
        amount={selectedAmount}
        onPaymentComplete={handlePaymentComplete}
        isTipMode={isTipMode}
      />

      {/* Money Breakdown Dialog */}
      <MoneyBreakdownDialog isOpen={showMoneyBreakdown} onClose={() => setShowMoneyBreakdown(false)} />

      {/* Feedback Dialog */}
      <FeedbackDialog isOpen={showFeedback} onClose={() => setShowFeedback(false)} />
    </>
  )
}
