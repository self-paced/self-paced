import { ApolloClient, InMemoryCache } from "@apollo/client";

let apiEndpoint =  ""

if (typeof window !== 'undefined' && process.env.NODE_ENV == 'development') {
    apiEndpoint = "http://localhost:3600/query"
} else if ( process.env.NODE_ENV == 'production' ) {
    apiEndpoint =  `${process.env.NEXT_PUBLIC_BACKEND_URL}/query`
} else if ( process.env.NODE_ENV == 'local' ) {
    apiEndpoint = "http://app:8080/query"
}else {
    apiEndpoint = "http://app:8080/query"
}

console.log(apiEndpoint)
const client = new ApolloClient({
  uri: apiEndpoint,
  cache: new InMemoryCache(),
})

export default client
