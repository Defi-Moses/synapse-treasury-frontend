import { gql } from '@apollo/client'

export const GET_HISTORICAL_FEES = gql`
    query GetHistoricalFees {
        dailyStatisticsByChain(type: FEE, duration: PAST_YEAR, useCache: true) {
            date
            total
        }
    }
`