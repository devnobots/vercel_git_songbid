"use client"

export default function UploadGuidelinesStandalone() {
  return (
    <div className="container mx-auto max-w-md p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Human Content Guidelines</h1>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Original Acoustic Music</h2>
          <p className="text-gray-700">
            Please submit a simple, live performance of your original song featuring just you and an acoustic guitar,
            another stringed instrument, piano, or presented acapella. No polished music videos, please!
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Acapella Visibility</h2>
          <p className="text-gray-700">
            If your performance is acapella, your face must be clearly visible throughout the entire video.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Human Performance (No AI)</h2>
          <p className="text-gray-700">
            Submissions must be authentic human performances. Video verification is required to ensure this, though a
            face is not required for non-a cappella submissions.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Adult Artists Only</h2>
          <p className="text-gray-700">You must be 18 years of age or older to upload content.</p>
        </div>
      </div>
    </div>
  )
}
