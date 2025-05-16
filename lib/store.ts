import { create } from "zustand"
import type { VideoData } from "@/types/video"

interface VideoStore {
  videos: VideoData[]
  isLoaded: boolean
  setVideos: (videos: VideoData[]) => void
  setLoaded: (loaded: boolean) => void
}

// Create a store to share video data between pages
export const useVideoStore = create<VideoStore>((set) => ({
  videos: [],
  isLoaded: false,
  setVideos: (videos) => set({ videos }),
  setLoaded: (loaded) => set({ isLoaded: loaded }),
}))
