// Initialize data storage for the application
export const initializeDataStorage = () => {
  if (typeof window === "undefined") return

  // Initialize users if not already present
  if (!localStorage.getItem("stylerent_users")) {
    const defaultUsers = [
      {
        id: "user-1",
        name: "Jane Smith",
        email: "jane@example.com",
        avatar: "/placeholder.svg?height=200&width=200",
        userType: "lender",
        bio: "Fashion enthusiast with a love for vintage pieces.",
        location: "New York, NY",
        joinedDate: "2023-01-15",
        totalItems: 12,
        activeItems: 8,
        totalRentals: 24,
        rating: 4.8,
        verified: true,
      },
      {
        id: "user-2",
        name: "Emily Johnson",
        email: "emily@example.com",
        avatar: "/placeholder.svg?height=200&width=200",
        userType: "lender",
        bio: "Sustainable fashion advocate sharing my designer collection.",
        location: "Los Angeles, CA",
        joinedDate: "2023-02-20",
        totalItems: 18,
        activeItems: 15,
        totalRentals: 32,
        rating: 4.9,
        verified: true,
      },
      {
        id: "user-3",
        name: "Michael Brown",
        email: "michael@example.com",
        avatar: "/placeholder.svg?height=200&width=200",
        userType: "lender",
        bio: "Menswear specialist with a focus on quality basics.",
        location: "Chicago, IL",
        joinedDate: "2023-03-10",
        totalItems: 9,
        activeItems: 7,
        totalRentals: 15,
        rating: 4.7,
        verified: true,
      },
    ]
    localStorage.setItem("stylerent_users", JSON.stringify(defaultUsers))
  }

  // Initialize items if not already present
  if (!localStorage.getItem("stylerent_items")) {
    const defaultItems = [
      {
        id: "item-1",
        name: "Vintage Denim Jacket",
        description: "Classic vintage denim jacket in excellent condition",
        baseRentalPrice: 25,
        rentalPrice: 25,
        images: ["/placeholder.svg?height=300&width=300"],
        media: [
          {
            type: "image",
            url: "/placeholder.svg?height=300&width=300",
          },
        ],
        category: "Outerwear",
        condition: "Excellent",
        brand: "Levi's",
        size: "M",
        listerId: "user-1",
        ownerId: "user-1",
        userId: "user-1",
        createdAt: new Date().toISOString(),
        ownerName: "Jane Smith",
        ownerAvatar: "/placeholder.svg?height=40&width=40",
        aesthetic: "Vintage",
        status: "Available",
      },
      {
        id: "item-2",
        name: "Designer Evening Gown",
        description: "Elegant black evening gown, perfect for formal events",
        baseRentalPrice: 75,
        rentalPrice: 75,
        images: ["/placeholder.svg?height=300&width=300"],
        media: [
          {
            type: "image",
            url: "/placeholder.svg?height=300&width=300",
          },
        ],
        category: "Dresses",
        condition: "Like New",
        designer: "Vera Wang",
        size: "S",
        listerId: "user-2",
        ownerId: "user-2",
        userId: "user-2",
        createdAt: new Date().toISOString(),
        ownerName: "Emily Johnson",
        ownerAvatar: "/placeholder.svg?height=40&width=40",
        aesthetic: "Luxury",
        status: "Available",
      },
      {
        id: "item-3",
        name: "Casual Linen Shirt",
        description: "Comfortable linen shirt for summer days",
        baseRentalPrice: 15,
        rentalPrice: 15,
        images: ["/placeholder.svg?height=300&width=300"],
        media: [
          {
            type: "image",
            url: "/placeholder.svg?height=300&width=300",
          },
        ],
        category: "Tops",
        condition: "Good",
        brand: "H&M",
        size: "L",
        listerId: "user-3",
        ownerId: "user-3",
        userId: "user-3",
        createdAt: new Date().toISOString(),
        ownerName: "Michael Brown",
        ownerAvatar: "/placeholder.svg?height=40&width=40",
        aesthetic: "Casual",
        status: "Available",
      },
    ]
    localStorage.setItem("stylerent_items", JSON.stringify(defaultItems))
  }

  // Initialize bundles if not already present
  if (!localStorage.getItem("stylerent_bundles")) {
    const defaultBundles = [
      {
        id: "bundle-1",
        title: "Summer Vacation Bundle",
        description: "Perfect collection for your beach getaway",
        price: 120,
        image: "/placeholder.svg?height=300&width=300",
        items: [
          {
            id: "item-1",
            name: "Vintage Denim Jacket",
            media: [{ type: "image", url: "/placeholder.svg?height=300&width=300" }],
          },
          {
            id: "item-3",
            name: "Casual Linen Shirt",
            media: [{ type: "image", url: "/placeholder.svg?height=300&width=300" }],
          },
        ],
        ownerId: "user-1",
        ownerName: "Jane Smith",
        ownerAvatar: "/placeholder.svg?height=40&width=40",
        createdAt: new Date().toISOString(),
        isPublished: true,
        aesthetic: "Casual",
        size: "M",
      },
    ]
    localStorage.setItem("stylerent_bundles", JSON.stringify(defaultBundles))
  }

  // Initialize following relationships if not already present
  if (!localStorage.getItem("stylerent_following")) {
    const defaultFollowing = [
      {
        id: "follow-1",
        followerId: "user-1",
        followedId: "user-2",
        createdAt: new Date().toISOString(),
      },
      {
        id: "follow-2",
        followerId: "user-1",
        followedId: "user-3",
        createdAt: new Date().toISOString(),
      },
      {
        id: "follow-3",
        followerId: "user-2",
        followedId: "user-1",
        createdAt: new Date().toISOString(),
      },
    ]
    localStorage.setItem("stylerent_following", JSON.stringify(defaultFollowing))
  }

  // Initialize reviews if not already present
  if (!localStorage.getItem("stylerent_reviews")) {
    const defaultReviews = [
      {
        id: "review-1",
        targetId: "user-1",
        targetType: "user",
        reviewerId: "user-2",
        reviewerName: "Emily Johnson",
        reviewerAvatar: "/placeholder.svg?height=40&width=40",
        rating: 5,
        comment: "Great lender! Items were exactly as described and in perfect condition.",
        createdAt: new Date().toISOString(),
      },
      {
        id: "review-2",
        targetId: "item-1",
        targetType: "item",
        reviewerId: "user-2",
        reviewerName: "Emily Johnson",
        reviewerAvatar: "/placeholder.svg?height=40&width=40",
        rating: 4,
        comment: "Beautiful jacket, fits true to size. Very versatile piece!",
        createdAt: new Date().toISOString(),
      },
    ]
    localStorage.setItem("stylerent_reviews", JSON.stringify(defaultReviews))
  }

  // Initialize orders if not already present
  if (!localStorage.getItem("orders")) {
    localStorage.setItem("orders", JSON.stringify([]))
  }

  // Initialize transactions if not already present
  if (!localStorage.getItem("transactions")) {
    localStorage.setItem("transactions", JSON.stringify([]))
  }

  console.log("Data storage initialized successfully")
}
