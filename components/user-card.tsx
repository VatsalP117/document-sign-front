import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import Logout from "@/components/logout";
export default function UserCard({
  name = "John Doe",
  email = "john@example.com",
  avatarUrl = "/placeholder.svg?height=100&width=100",
}) {
  return (
    <Card className="w-full md:w-3/4 max-w-md mx-auto">
      <CardContent className="flex items-center space-x-4 p-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback>
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">{name}</h2>
          <p className="text-muted-foreground">{email}</p>
        </div>
      </CardContent>
    </Card>
  );
}
