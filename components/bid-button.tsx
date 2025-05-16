"use client"

import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

interface BidButtonProps {
  onClick: () => void
}

export default function BidButton({ onClick }: BidButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="h-[25px] w-[48px] rounded-md bg-green-500 hover:bg-green-600 text-white font-medium text-sm p-0 flex items-center justify-center"
    >
      <Heart className="h-4 w-4" />
    </Button>
  )
}
