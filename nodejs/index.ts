// Import required modules and classes
import fetch from 'cross-fetch';
import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client/core';
import { Buffer } from 'node:buffer';

// Define the CurriClientService class
class CurriClientService {
  // Private fields to store user ID, API key, GraphQL client instance, and current user details
  private userID:string;
  private apiKey:string;
  private client:any;
  private currentUser:any;

  // Constructor initializes the client with given configuration
  constructor(config:any) {
    this.userID = config.userID;
    this.apiKey = config.apiKey;
        // Setup the GraphQL client with the API URL and authentication credentials
    this.setClient("https://api.curri.com/graphql", this.userID, this.apiKey);
  }

  // Method to fetch a delivery quote based on provided arguments
  public async quote(quoteArgs:any) {
    // GraphQL query for fetching a delivery quote
    const query =  gql`
          query DeliveryQuote($origin:AddressInput, $destination:AddressInput, $priority:String, $deliveryMethod:String, $manifestItems:[ManifestItemInput]){
            deliveryQuote(
                origin: $origin,
                destination: $destination,
                priority: $priority,
                deliveryMethod: $deliveryMethod,
                manifestItems: $manifestItems
            )
            {
              id
              fee
              distance
              duration
              pickupDuration
              deliveryMethod
            }
          }
        `;

    // Execute the query with provided arguments and return the result
    const res = await this.client
    .query({
        query:query,
        variables:{
          quoteArgs:quoteArgs,
          origin:quoteArgs.origin,
          destination:quoteArgs.destination,
          priority:quoteArgs.priority,
          deliveryMethod:quoteArgs.deliveryMethod,
          manifestItems:quoteArgs.manifestItems,
        }
    })
    return res.data.deliveryQuote;
  }

  // Method to fetch a quote for a delivery with multiple stops
  public async quoteMultistop(quoteArgs:any) {
    // GraphQL mutation for creating a booking quote with multiple stops
    const mutation =  gql`
        mutation CreateBookingQuote($stops:[BookingQuoteStopInput!]!, $priority:String!, $deliveryMethods:[String!]){
          createBookingQuote(
              stops: $stops,
              priority: $priority,
              deliveryMethods: $deliveryMethods
          )
          {
         id 
         deliveryMethod
         price
         distance
          }
        }
      `;

      // Execute the mutation with provided arguments and return the result
      try {
      const res = await this.client.mutate({
          mutation:mutation,
          variables:{
            quoteArgs:quoteArgs,
            stops:quoteArgs.stops,
            priority:quoteArgs.priority,
            deliveryMethods:quoteArgs.deliveryMethods
          }
      })
      return res.data.createBookingQuote;       
      }catch(error:any) {
        throw error;
      }
  }

  // Method to book a delivery with given booking arguments
  public async book(bookingArgs:any) {
        // GraphQL mutation for booking a delivery
    const mutation =  gql`
          mutation Delivery($bookingArgs:BookDeliveryInput!){
            bookDelivery(
              data: $bookingArgs
            )
            {
              id
              price
              createdAt
              deliveryMethod
              deliveredAt
            }
          }
      `;
      // Execute the mutation with provided arguments and return the result
      const res = await this.client
      .mutate({
        mutation:mutation,
        variables:{
          bookingArgs:bookingArgs
        }
      })
      return res.data.bookDelivery;   
  }

  // Method to book a delivery with multiple stops
  public async bookMulti(bookingArgs:any) {
    // GraphQL mutation for creating a booking with multiple stops
    const mutation =  gql`
          mutation CreateBooking($quoteId:String, $stops:[BookingStopInput], $scheduledAt:String, $declaredValue:Int, $manifestItems:[ManifestItemInput!], $notesForDispatcher:String, $attachments: [DeliveryAttachmentInput!]){
            createBooking(
              quoteId:$quoteId,
              stops:$stops,
              scheduledAt:$scheduledAt,
              declaredValue:$declaredValue,
              manifestItems:$manifestItems,
              notesForDispatcher:$notesForDispatcher,
              attachments: $attachments
            )
            {
              id
              price
              distance
              deliveryMethod
              deliveryIds
            }
          }
      `;
      // Execute the mutation with provided arguments and return the result
      const res = await this.client
  }


  private setClient(uri:string = "https://api.curri.com/graphql", userID:string, apiKey:String) {

  const defaultOptions:any = {
        watchQuery: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'ignore',
        },
        query: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all',
        },
      }

    const base64Auth = Buffer.from(`${userID}:${apiKey}`).toString('base64');
    this.client = new ApolloClient({
      cache: new InMemoryCache({resultCaching:false}),
      link: new HttpLink({
        uri: uri,
        fetch,
        headers: {
          authorization: `Basic ${base64Auth}`
        }
      }),
      defaultOptions:defaultOptions
    }); 
  }


}
     
