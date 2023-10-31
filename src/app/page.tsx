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
          <div className='w-1/8 flex justify-center gap-[0.5rem] items-center bg-black mt-4'>
            <a
              href='https://github.com/Defi-Moses/synapse-treasury/blob/main/README.md#methodology'
              target='_blank'
              rel='noopener noreferrer'
              className='text-white'
            >
              <sub>
                * Methodology can be found
                <span className='text-blue-500'> here</span>
              </sub>
            </a>
          </div>
        </main>
      </ApolloProvider>
    </div>
  )
}
