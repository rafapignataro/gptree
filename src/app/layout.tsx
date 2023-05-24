import './globals.css';
import { Inter } from 'next/font/google';
import { Coins } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'GPTree',
  description: 'Your Tree History Assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="container max-w-7xl mx-auto flex items-center justify-between py-4">
          <h1 className="text-lg font-bold text-gray-700">GPTree</h1>
          <div className="flex items-center justify-center">
            <Coins size="20" className="mr-2 text-yellow-600" />
            <p className="text-md font-bold text-gray-700">98 credits</p>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}
