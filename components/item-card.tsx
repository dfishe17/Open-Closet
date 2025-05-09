import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Ruler } from "lucide-react"
import { FollowButton } from "@/components/follow-button"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

interface ItemCardProps {
  id: string
  name: string
  price: number
  image: string
  category?: string
  condition?: string
  size?: string // Make size optional to handle existing data
  ownerName?: string
  ownerAvatar?: string
  ownerId?: string
  showOwnerActions?: boolean
}

export function ItemCard({
  id,
  name,
  price,
  image,
  category,
  condition,
  size,
  ownerName,
  ownerAvatar,
  ownerId,
  showOwnerActions = false,
}: ItemCardProps) {
  return (
    <Card className="overflow-hidden border-0 shadow-sm transition-all hover:shadow-md">
      <Link href={`/items/${id}`} className="group">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={image || "/placeholder.svg?height=400&width=400"}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium">{name}</h3>
              <p className="text-sm text-muted-foreground">${price}/day</p>
            </div>
          </div>
        </CardContent>
      </Link>

      <CardFooter className="flex flex-wrap gap-2 p-4 pt-0">
        {category && (
          <Badge variant="secondary" className="font-normal">
            {category}
          </Badge>
        )}
        {condition && (
          <Badge variant="outline" className="font-normal">
            {condition}
          </Badge>
        )}
        {size && (
          <Badge variant="outline" className="flex items-center gap-1 font-normal">
            <Ruler className="h-3 w-3" />
            {size}
          </Badge>
        )}

        {showOwnerActions && ownerName && ownerId && (
          <div className="w-full mt-3 pt-3 border-t flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src={ownerAvatar || "/placeholder.svg"}
                alt={ownerName}
                className="h-6 w-6 rounded-full object-cover"
              />
              <span className="text-xs text-muted-foreground">{ownerName}</span>
            </div>
            <div className="flex space-x-1">
              <Button variant="ghost" size="sm" className="h-7 px-2">
                <MessageSquare className="h-3 w-3" />
              </Button>
              <FollowButton userId={ownerId} size="sm" />
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
