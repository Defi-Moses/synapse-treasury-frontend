'use client'
import Image from 'next/image'
import React from 'react'
import ChainHoldings from '@/components/chainHoldings.js'
import TokenList from '@/components/tokenList.js'
import MonthList from '@/components/pastHoldings.js'
import PieChart from '@/components/pieChart.js'
import dynamic from 'next/dynamic'
import { ApolloProvider } from '@apollo/client'
import client from '@/utils/apollo-client'
import Badge from '@/components/library/Badge.jsx'

export default function Home() {
  return (
    <div className='bg-black'>
      <ApolloProvider client={client}>
        <main className='flex min-h-screen flex-col items-center p-6 md:p-12'>
          <h1 className='text-xl md:text-4xl font-bold font-inter text-white'>Synapse Treasury Holdings</h1>
          <div className='flex items-center justify-center py-4 w-full mb-6'>
            <Badge>Last Updated 10-22-2023</Badge>
          </div>

          <div className='flex flex-col flex-wrap sm:flex-row items-center gap-[1.5rem] justify-center'>
            <PieChart />
            <div className='flex flex-wrap justify-center gap-[1.5rem] min-h-[576px]'>
              <ChainHoldings />
              <TokenList />
            </div>
          </div>
          <h3 className='font-bold font-inter py-4 text-white'>Historical Data</h3>
          <MonthList />

          <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
            {/* <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        /> */}
          </div>
        </main>
        <div className='w-1/8 flex justify-center items-center bg-black '>
          <a
            href='https://github.com/Defi-Moses/synapse-treasury/blob/main/README.md#methodology'
            target='_blank'
            rel='noopener noreferrer'
            className='text-white'
          >
            Methodology can be found
            <span className='text-blue-500'> here</span>
          </a>
        </div>
      </ApolloProvider>
    </div>
  )
}
