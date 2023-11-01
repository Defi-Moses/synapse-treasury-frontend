'use client'
import Image from 'next/image'
import React from 'react'
import ChainHoldings from '@/components/chainHoldings.js'
import TokenList from '@/components/tokenList.js'
import PastHoldings from '@/components/pastHoldings.js'
import PieChart from '@/components/pieChart.js'
import dynamic from 'next/dynamic'
import { ApolloProvider } from '@apollo/client'
import client from '@/utils/apollo-client'
import Badge from '@/components/library/Badge.jsx'
import { logo } from './constants'
import styles from './page.module.scss'

export default function Home() {
  return (
    <div className='bg-black'>
      <ApolloProvider client={client}>
        <main className='flex min-h-screen flex-col items-center p-6 md:p-12'>
          <div className='flex w-full'>
            <div className='relative flex flex-col items-center justify-center w-fit'>
              {logo}
              <span className={`text-xl md:text-xl font-bold font-inter text-white ${styles.treasury}`}>
                Treasury Holdings
              </span>
              <span className={`text-xl md:text-xl font-bold font-inter text-white ${styles.updated}`}>10-22-2023</span>
            </div>
            <div className='flex h-fit'></div>
          </div>

          <div className='flex flex-col flex-wrap items-center sm:items-start sm:flex-row gap-[1.5rem] justify-center mt-24 '>
            <PieChart />
            <div className='flex flex-wrap justify-center gap-[1.5rem] min-h-[576px]'>
              <ChainHoldings />
              <TokenList />
            </div>
          </div>
          <PastHoldings />

          <div className='w-1/8 flex justify-center gap-[0.5rem] items-center bg-black mt-4'>
            <a
              href='https://github.com/Defi-Moses/synapse-treasury/blob/main/README.md#methodology'
              target='_blank'
              rel='noopener noreferrer'
              className='text-white'
            >
              <div className='flex flex-col gap-5 justify-center items-center mt-4 '>
                <sub>
                  * Methodology can be found
                  <span className='text-blue-500'> here</span>
                </sub>
              </div>
            </a>
          </div>
        </main>
      </ApolloProvider>
    </div>
  )
}
