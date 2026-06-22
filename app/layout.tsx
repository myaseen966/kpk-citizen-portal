// This is the ROOT LAYOUT — it wraps every single page in the app.
// Think of it as the outer shell. Every page appears inside {children}.

import type { Metadata } from 'next'
import './globals.css'

// This sets the browser tab title and description
export const metadata: Metadata = {
  title: 'KPK Citizen Portal | Government of Khyber Pakhtunkhwa',
  description: 'KPK Citizen Portal - Serving the people of Khyber Pakhtunkhwa.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* Every page loads here */}
        {children}
      </body>
    </html>
  )
}