import { ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  uri: 'https://explorer.omnirpc.io/graphql',
  cache: new InMemoryCache(),
  ssrMode: true,
})

export default client
