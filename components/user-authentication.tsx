"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogIn, User, UserPlus } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserAuthentication() {
    const { isSignedIn, user } = useUser();
    const { signOut, openSignIn, openSignUp } = useClerk();

    return isSignedIn ? (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar>
                    <AvatarImage
                        src={user.imageUrl}
                        alt={user.username ?? "user-image"}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user?.fullName}</p>
                        <p className="text-xs text-muted-foreground">
                            {user?.emailAddresses[0].emailAddress}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                        Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/profile?tab=orders" className="cursor-pointer">
                        Orders
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                    <p
                        className="w-full"
                        onClick={() => signOut({ redirectUrl: "/" })}
                    >
                        Sign Out
                    </p>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ) : (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <User className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => openSignIn()}
                >
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Sign In</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => openSignUp()}
                >
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>Create Account</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
