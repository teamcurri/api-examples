import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client'
import fetch from 'node-fetch'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'https://api.curri.com/graphql',
    fetch,
    headers: {
      authorization: `Basic ${process.env.CURRI_API_KEY || 'INSERT_BASE_64_USERID_AND_APIKEY'}`
    }
  })
});

(async () => {
  const userResponse = await client
  .query({
    query: gql`
      {
        currentUser {
          id
        }
      }
    `
  })

  console.log(userResponse)
  if (!userResponse.data.currentUser.id) {
    throw new Error('We were unable to authenticate you')
  }

  console.log('Logged in as:', userResponse)

  const quoteResponse = await client
  .query({
    query: gql`
      query {
        deliveryQuote(
          destination: {
            name: "Curri Incubator",
            addressLine1: "54 S Oak St.",
            city: "Ventura",
            state: "CA",
            postalCode: 93001
          },
          origin: {
            name: "305 South Kalorama Street",
            addressLine1: "305 S Kalorama St",
            city: "Ventura",
            state: "CA",
            postalCode: 93001
          },
          deliveryMethod: "truck"
        ) {
          id
          fee
          distance
          duration
          pickupDuration
          deliveryMethod
        }
      }
    `
  })

  console.log('Quote:', quoteResponse)

  try {
    const bookResponse = await client
    .mutate({
      mutation: gql`
        mutation {
          bookDelivery(
            data: {
              deliveryQuoteId: "${quoteResponse.data.deliveryQuote.id}"
            }
          )
          {
            id
            price
            createdAt
            deliveryMethod
            deliveredAt
          }
        }
      `
    })

    console.log('Book Delivery:', bookResponse)

  } catch (error) {
    console.log(error)
  }

})()
