import { Inter } from 'next/font/google'
import { cn } from "@/lib/utils"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn(
        inter.className,
        "min-h-screen bg-gradient-to-b from-background/90 to-background/70 text-foreground"
      )}>
        {children}
      </body>
    </html>
  )
}