import { gql } from '@apollo/client'

export const GET_HISTORICAL_FEES = gql`
    query GetHistoricalFees {
        dailyStatisticsByChain(type: FEE, duration: ALL_TIME, useCache: true) {
            date
            total
        }
    }
`