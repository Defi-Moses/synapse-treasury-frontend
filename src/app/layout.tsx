import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Synapse DAO Treasury',
  description: 'Transparency into the Synapse DAO Treasury',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='bg-black'>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
