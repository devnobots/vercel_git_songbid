"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ArrowLeft, Check, CreditCard, Lock } from "lucide-react"
import Image from "next/image"

interface PaymentMethodDialogProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  onPaymentComplete?: () => void
  isTipMode?: boolean // New prop to determine if this is a tip or fund
}

export default function PaymentMethodDialog({
  isOpen,
  onClose,
  amount,
  onPaymentComplete,
  isTipMode = false,
}: PaymentMethodDialogProps) {
  const [selectedMethod, setSelectedMethod] = useState<"credit" | "cashapp" | "venmo">("credit")
  const [cardNumber, setCardNumber] = useState("")
  const [expDate, setExpDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [billingZip, setBillingZip] = useState("")
  const [cashAppIconError, setCashAppIconError] = useState(false)
  const [venmoIconError, setVenmoIconError] = useState(false)

  // Reset error states when dialog opens
  useEffect(() => {
    if (isOpen) {
      setCashAppIconError(false)
      setVenmoIconError(false)
    }
  }, [isOpen])

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

  const handleSubmit = () => {
    console.log(`Processing payment of $${amount} via ${selectedMethod}`)
    // In a real app, you would process the payment here
    if (onPaymentComplete) {
      onPaymentComplete()
    }
    onClose()
  }

  const handleBack = () => {
    onClose()
  }

  // Determine button text based on mode
  const buttonText = isTipMode ? `Tip $${amount} Now` : `Fund $${amount} Now`

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 bg-gray-50 rounded-xl overflow-hidden border-0">
        <div className="p-6 pt-4 relative">
          {/* Back button */}
          <button
            onClick={handleBack}
            className="absolute left-4 top-4 flex items-center text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span className="text-sm">Back</span>
          </button>

          {/* Top icon - Changed to green lock icon */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center">
              <Lock className="h-7 w-7 text-green-500" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center mb-5">Select a Payment Method</h2>

          {/* Payment methods */}
          <div className="space-y-3 mb-5">
            {/* Credit Card Option - with green highlight */}
            <div
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedMethod === "credit"
                  ? "border-green-500 bg-white"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
              onClick={() => setSelectedMethod("credit")}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="font-medium">Credit Card</span>
                </div>
                <div
                  className={`w-5 h-5 rounded-full ${
                    selectedMethod === "credit" ? "bg-green-500" : "border border-gray-300"
                  } flex items-center justify-center`}
                >
                  {selectedMethod === "credit" && <Check className="h-3 w-3 text-white" />}
                </div>
              </div>

              {selectedMethod === "credit" && (
                <div className="space-y-3 mt-2">
                  <div>
                    <input
                      type="text"
                      placeholder="Credit Card Number"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Exp Date"
                      value={expDate}
                      onChange={(e) => setExpDate(e.target.value)}
                      className="p-2 border border-gray-300 rounded-md text-sm"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="p-2 border border-gray-300 rounded-md text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Billing Zip"
                      value={billingZip}
                      onChange={(e) => setBillingZip(e.target.value)}
                      className="p-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Cash App Option */}
            <div
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedMethod === "cashapp"
                  ? "border-green-500 bg-white"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
              onClick={() => setSelectedMethod("cashapp")}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-5 w-5 mr-2 relative flex items-center justify-center">
                    {cashAppIconError ? (
                      <span className="text-xs font-bold text-green-600">$</span>
                    ) : (
                      <Image
                        src="/cash-app-icon.png"
                        alt="Cash App"
                        width={20}
                        height={20}
                        onError={() => setCashAppIconError(true)}
                      />
                    )}
                  </div>
                  <span className="font-medium">Cash App</span>
                </div>
                <div
                  className={`w-5 h-5 rounded-full ${
                    selectedMethod === "cashapp" ? "bg-green-500" : "border border-gray-300"
                  } flex items-center justify-center`}
                >
                  {selectedMethod === "cashapp" && <Check className="h-3 w-3 text-white" />}
                </div>
              </div>
            </div>

            {/* Venmo Option */}
            <div
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedMethod === "venmo"
                  ? "border-green-500 bg-white"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
              onClick={() => setSelectedMethod("venmo")}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-5 w-5 mr-2 relative flex items-center justify-center">
                    {venmoIconError ? (
                      <span className="text-xs font-bold text-blue-600">V</span>
                    ) : (
                      <Image
                        src="/venmo-icon.png"
                        alt="Venmo"
                        width={20}
                        height={20}
                        onError={() => setVenmoIconError(true)}
                      />
                    )}
                  </div>
                  <span className="font-medium">Venmo</span>
                </div>
                <div
                  className={`w-5 h-5 rounded-full ${
                    selectedMethod === "venmo" ? "bg-green-500" : "border border-gray-300"
                  } flex items-center justify-center`}
                >
                  {selectedMethod === "venmo" && <Check className="h-3 w-3 text-white" />}
                </div>
              </div>
            </div>
          </div>

          {/* Fund/Tip button - Using the selected amount */}
          <Button onClick={handleSubmit} className="w-full py-5 text-xl bg-[#e84c30] hover:bg-[#e84c30]/90 text-white">
            {buttonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
