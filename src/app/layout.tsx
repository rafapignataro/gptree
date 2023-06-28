import { Inter } from 'next/font/google';
import { Coins } from 'lucide-react'
import { Button } from '@/components/ui/button';

import './globals.css';

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
      <body className={`relative ${inter.className}`}>
        {/* <header className="bg-white border-b-gray-200 border-b-2 z-50 w-full h-16 flex items-center">
          <div className="z-10 container max-w-7xl mx-auto flex items-center justify-between py-2">
            <div className="flex items-center justify-between gap-2">
              <svg className="w-10 h-10" width="272" height="165" viewBox="0 0 272 165" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="72" width="128" height="64" rx="8" fill="#1D1D1D"/>
                <rect x="144" y="101" width="128" height="64" rx="8" fill="#1D1D1D"/>
                <rect y="101" width="128" height="64" rx="8" fill="#1D1D1D"/>
                <path d="M208.64 84.0001L209.64 84.0001L209.64 84.0001L208.64 84.0001ZM208.64 101L202.867 91.0001L214.414 91.0001L208.64 101ZM137.217 68.5246L136.225 68.6512L136.225 68.6512L137.217 68.5246ZM153.089 82.5L153.089 81.5L153.089 81.5L153.089 82.5ZM207.14 82.5001L207.14 81.5001L207.14 81.5001L207.14 82.5001ZM209.64 84.0001L209.64 92.0001L207.64 92.0001L207.64 84.0001L209.64 84.0001ZM137.632 63.8736L138.209 68.3981L136.225 68.6512L135.648 64.1267L137.632 63.8736ZM153.089 81.5L207.14 81.5001L207.14 83.5001L153.089 83.5L153.089 81.5ZM207.14 81.5001C208.521 81.5001 209.64 82.6194 209.64 84.0001L207.64 84.0001C207.64 83.7239 207.416 83.5001 207.14 83.5001L207.14 81.5001ZM138.209 68.3981C139.165 75.8878 145.538 81.5 153.089 81.5L153.089 83.5C144.531 83.5 137.308 77.1395 136.225 68.6512L138.209 68.3981Z" fill="black"/>
                <path d="M64.5208 84.0001L63.5208 84.0001L63.5208 84.0001L64.5208 84.0001ZM64.5208 101L70.2943 91.0001L58.7473 91.0001L64.5208 101ZM135.944 68.5246L136.936 68.6512L136.936 68.6512L135.944 68.5246ZM120.072 82.5L120.072 81.5L120.072 81.5L120.072 82.5ZM66.0208 82.5001L66.0208 81.5001L66.0208 81.5001L66.0208 82.5001ZM63.5208 84.0001L63.5208 92.0001L65.5208 92.0001L65.5208 84.0001L63.5208 84.0001ZM135.529 63.8736L134.952 68.3981L136.936 68.6512L137.513 64.1267L135.529 63.8736ZM120.072 81.5L66.0208 81.5001L66.0208 83.5001L120.072 83.5L120.072 81.5ZM66.0208 81.5001C64.6401 81.5001 63.5208 82.6194 63.5208 84.0001L65.5208 84.0001C65.5208 83.7239 65.7447 83.5001 66.0208 83.5001L66.0208 81.5001ZM134.952 68.3981C133.996 75.8878 127.623 81.5 120.072 81.5L120.072 83.5C128.629 83.5 135.853 77.1395 136.936 68.6512L134.952 68.3981Z" fill="black"/>
              </svg>
              <h1 className="text-lg font-bold text-gray-800">GPTree</h1>
            </div>
            <div className="flex items-center justify-center">
              <Button variant="default" size="sm" className="mr-2">Buy more</Button>
              <p className="text-md font-bold text-gray-800 mr-2">98 credits</p>
              <Coins size="20" className="text-yellow-600" />
            </div>
          </div>
        </header> */}
        <main className="h-screen overflow-hidden">
          {children}
        </main>
      </body> 
    </html>
  )
}
