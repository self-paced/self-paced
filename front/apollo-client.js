import { ApolloClient, InMemoryCache } from "@apollo/client";

const apiEndpoint =  `${process.env.NEXT_PUBLIC_BACKEND_URL}/query`
console.log(apiEndpoint)
const client = new ApolloClient({
  uri: apiEndpoint,
  cache: new InMemoryCache(),
})

export default client
