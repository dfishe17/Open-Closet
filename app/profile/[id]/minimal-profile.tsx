"use client"

import { useState } from "react"
import { Star, X } from "lucide-react"

export default function MinimalProfile({ params }) {
  const [showFollowersPopup, setShowFollowersPopup] = useState(false)
  const [showFollowingPopup, setShowFollowingPopup] = useState(false)
  const [showRatingPopup, setShowRatingPopup] = useState(false)

  return (
    <div className="container max-w-md mx-auto py-8 px-4 flex flex-col items-center">
      {/* Avatar */}
      <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 flex items-center justify-center">
        <span className="text-gray-400">a</span>
      </div>

      {/* Name and Email */}
      <h2 className="text-xl font-bold">a</h2>
      <p className="text-sm text-gray-600 mb-6">test@test.com</p>

      {/* Followers and Following */}
      <div className="flex w-full justify-between mb-6">
        <div
          className="flex-1 text-center cursor-pointer"
          onClick={() => setShowFollowersPopup(true)}
          style={{ transition: "background-color 0.2s" }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <p className="text-xl font-bold">0</p>
          <p className="text-sm text-gray-600">Followers</p>
        </div>
        <div
          className="flex-1 text-center cursor-pointer"
          onClick={() => setShowFollowingPopup(true)}
          style={{ transition: "background-color 0.2s" }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <p className="text-xl font-bold">0</p>
          <p className="text-sm text-gray-600">Following</p>
        </div>
      </div>

      {/* Rating */}
      <div
        className="flex items-center mb-6 cursor-pointer px-4 py-1 rounded-md"
        onClick={() => setShowRatingPopup(true)}
        style={{ transition: "background-color 0.2s" }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      >
        <span className="text-lg font-bold mr-1">N/A</span>
        <Star className="h-5 w-5 text-yellow-400" />
        <span className="text-sm text-gray-600 ml-1">Rating</span>
      </div>

      {/* Account Settings Button */}
      <button className="w-full py-2 px-4 border border-gray-300 rounded-md mb-2 hover:bg-gray-50 transition-colors">
        Account Settings
      </button>

      {/* NO Messages Button */}
      {/* Intentionally removed */}

      {/* Followers Popup */}
      {showFollowersPopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-lg">Followers</h3>
              <button className="p-1 rounded-full hover:bg-gray-100" onClick={() => setShowFollowersPopup(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              <p className="text-center py-4 text-gray-500">No followers yet</p>
            </div>
          </div>
        </div>
      )}

      {/* Following Popup */}
      {showFollowingPopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-lg">Following</h3>
              <button className="p-1 rounded-full hover:bg-gray-100" onClick={() => setShowFollowingPopup(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              <p className="text-center py-4 text-gray-500">Not following anyone yet</p>
            </div>
          </div>
        </div>
      )}

      {/* Rating Popup */}
      {showRatingPopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-lg">Ratings & Reviews</h3>
              <button className="p-1 rounded-full hover:bg-gray-100" onClick={() => setShowRatingPopup(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              <div className="flex items-center justify-center mb-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">N/A</p>
                  <div className="flex items-center justify-center my-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-gray-300" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">No ratings yet</p>
                </div>
              </div>
              <p className="text-center py-4 text-gray-500">No reviews yet</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
