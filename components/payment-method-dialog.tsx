"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ArrowLeft, CreditCard, Lock } from "lucide-react"

interface PaymentMethodDialogProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  onPaymentComplete?: () => void
  isTipMode?: boolean
}

export default function PaymentMethodDialog({
  isOpen,
  onClose,
  amount,
  onPaymentComplete,
  isTipMode = false,
}: PaymentMethodDialogProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [expDate, setExpDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  // Format expiry date
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  // Pause all videos when dialog is open
  useEffect(() => {
    if (isOpen) {
      const videos = document.querySelectorAll("video")
      videos.forEach((video) => {
        video.pause()
        video.currentTime = 0
      })

      const iframes = document.querySelectorAll("iframe")
      iframes.forEach((iframe) => {
        if (iframe.src.includes("vimeo.com")) {
          const originalSrc = iframe.src
          iframe.setAttribute("data-original-src", originalSrc)
          if (originalSrc.includes("autoplay=1")) {
            iframe.src = originalSrc.replace("autoplay=1", "autoplay=0")
          } else {
            iframe.src = ""
          }
        }
      })
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(`Processing payment of $${amount}`)
    if (onPaymentComplete) {
      onPaymentComplete()
    }
    onClose()
  }

  const handleBack = () => {
    onClose()
  }

  const buttonText = isTipMode ? `Tip $${amount}` : `Pay $${amount}`

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 bg-[#f5f1e8] rounded-xl overflow-hidden border-0 font-elegant-typewriter [&>button]:hidden">
        <div className="p-6 pt-4 pb-4 relative">
          {/* Back button */}
          <button
            onClick={handleBack}
            className="absolute left-4 top-4 flex items-center text-[#8b7355] hover:text-[#6b5a47]"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span className="text-sm">Back</span>
          </button>

          {/* Title - Removed the security indicator icon */}
          <h2 className="text-2xl font-bold text-center mt-6 mb-6 text-[#8b7355]">Payment Details</h2>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#6b5a47] mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full p-3 border border-[#d4c4a8] rounded-lg text-[#6b5a47] bg-white focus:outline-none focus:ring-2 focus:ring-[#8b7355] focus:border-transparent"
                required
              />
            </div>

            {/* Card Information */}
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-[#6b5a47] mb-2">
                Card information
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="1234 1234 1234 1234"
                  maxLength={19}
                  className="w-full p-3 border border-[#d4c4a8] rounded-t-lg text-[#6b5a47] bg-white focus:outline-none focus:ring-2 focus:ring-[#8b7355] focus:border-transparent"
                  required
                />
                <CreditCard className="absolute right-3 top-3 h-5 w-5 text-[#8b7355]" />
              </div>

              <div className="grid grid-cols-2 gap-0">
                <input
                  type="text"
                  value={expDate}
                  onChange={(e) => setExpDate(formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="p-3 border border-[#d4c4a8] border-t-0 border-r-0 rounded-bl-lg text-[#6b5a47] bg-white focus:outline-none focus:ring-2 focus:ring-[#8b7355] focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").substring(0, 4))}
                  placeholder="CVC"
                  maxLength={4}
                  className="p-3 border border-[#d4c4a8] border-t-0 rounded-br-lg text-[#6b5a47] bg-white focus:outline-none focus:ring-2 focus:ring-[#8b7355] focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Cardholder name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#6b5a47] mb-2">
                Cardholder name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name on card"
                className="w-full p-3 border border-[#d4c4a8] rounded-lg text-[#6b5a47] bg-white focus:outline-none focus:ring-2 focus:ring-[#8b7355] focus:border-transparent"
                required
              />
            </div>

            {/* Security notice */}
            <div className="flex items-center justify-center text-xs text-[#8b7355] mt-4 mb-4">
              <Lock className="h-3 w-3 mr-1" />
              <span>
                Secured by <span className="text-[#6b5a47]">Stripe</span>
              </span>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full py-4 text-lg bg-[#f5f1e8] hover:bg-[#ede5d8] text-[#8b7355] border border-[#8b7355] rounded-full font-elegant-typewriter"
            >
              {buttonText}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
