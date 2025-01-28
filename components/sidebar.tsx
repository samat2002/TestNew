"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    Home,
    Settings,
    BarChart3,
    Users,
    FolderOpen,
    MessagesSquare,
} from "lucide-react"

const routes = [
    {
        label: 'Home',
        icon: Home,
        href: '/',
        color: "text-sky-500"
    },
    {
        label: 'Analytics',
        icon: BarChart3,
        href: '/analytics',
        color: "text-violet-500",
    },
    {
        label: 'Users',
        icon: Users,
        href: '/users',
        color: "text-pink-700",
    },
    {
        label: 'Projects',
        icon: FolderOpen,
        href: '/projects',
        color: "text-orange-700",
    },
    {
        label: 'Messages',
        icon: MessagesSquare,
        href: '/messages',
        color: "text-emerald-500",
    },
    {
        label: 'Settings',
        icon: Settings,
        href: '/settings',
    },
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-gray-900 text-white">
            <div className="px-3 py-2 flex-1">
                <div className="space-y-1">
                    <h2 className="text-lg font-semibold tracking-tight mb-4">
                        Dashboard
                    </h2>
                    <nav className="space-y-1">
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                    pathname === route.href ? "text-white bg-white/10" : "text-zinc-400",
                                )}
                            >
                                <div className="flex items-center flex-1">
                                    <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                    {route.label}
                                </div>
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    )
}