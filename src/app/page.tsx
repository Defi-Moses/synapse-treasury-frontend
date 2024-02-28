'use client'
import Image from 'next/image'
import React from 'react'
import ChainHoldings from '@/components/chainHoldings.js'
import TokenList from '@/components/tokenList.js'
import PastHoldings from '@/components/pastHoldings.js'
import PieChart from '@/components/pieChart.js'
import { ApolloProvider } from '@apollo/client'
import client from '@/utils/apollo-client'
import { logo } from './constants'
import styles from './page.module.scss'
import { useWindowSize } from '@uidotdev/usehooks'
import { IoArrowRedoCircleSharp } from 'react-icons/io5'

export default function Home() {
  const size = useWindowSize()
  const isNotDesktop = size.width && size.width <= 1024
  const isDesktop = size.width && size.width >= 1024

  return (
    <div className='bg-black'>
      {isDesktop && (
        <div className={`fixed flex  bottom-3 right-3 bg-black text-bold ${styles.methodology}`}>
          <div className='max-w-[110px]'>
            <span className='text-white'>Open to read</span>{' '}
            <u>
              <a
                href='https://github.com/Defi-Moses/synapse-treasury/blob/main/README.md#methodology'
                target='_blank'
                rel='noopener noreferrer'
                className='text-[#ca6bff]'
              >
                methodology
              </a>
            </u>
          </div>
          <a
            href='https://github.com/Defi-Moses/synapse-treasury/blob/main/README.md#methodology'
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-500'
          >
            <IoArrowRedoCircleSharp className='bg-[#ca6bff] rounded-full text-white w-[48px] h-[48px] z-[99] cursor-pointer' />
          </a>
        </div>
      )}

      <ApolloProvider client={client}>
        <main className={styles.main}>
          <div className={styles.logo}>
            <div className='relative flex flex-col items-center justify-center w-fit'>
              {logo}
              <span className={`text-xl md:text-xl font-bold font-inter text-white ${styles.treasury}`}>
                Treasury Holdings
              </span>
              <span className={styles.updated}>Feb-28-2024</span>
            </div>
            <div className='flex h-fit'></div>
          </div>

          <div className='flex flex-col flex-wrap items-center sm:items-start sm:flex-row gap-[1.5rem] justify-center mt-[100px] md:mt-[80px] '>
            <PieChart />
            <div className='flex flex-wrap justify-center gap-[1.5rem] mb-8'>
              <ChainHoldings />
              <TokenList />
            </div>
          </div>
          <PastHoldings />
        </main>
      </ApolloProvider>

      {isNotDesktop && (
        <div className={`flex justify-center mt-[2rem] bg-black text-bold ${styles.methodology}`}>
          <div className='max-w-[110px]'>
            <span className='text-white'>Open to read</span>{' '}
            <u>
              <a
                href='https://github.com/Defi-Moses/synapse-treasury/blob/main/README.md#methodology'
                target='_blank'
                rel='noopener noreferrer'
                className='text-[#ca6bff]'
              >
                methodology
              </a>
            </u>
          </div>
          <a
            href='https://github.com/Defi-Moses/synapse-treasury/blob/main/README.md#methodology'
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-500'
          >
            <IoArrowRedoCircleSharp className='bg-[#ca6bff] rounded-full text-white w-[48px] h-[48px] z-[99] cursor-pointer' />
          </a>
        </div>
      )}
    </div>
  )
}
