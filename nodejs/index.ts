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

  public async updateDelivery(updateDeliveryArgs:any) {
    const mutation =  gql`
          mutation updateDelivery($updateDeliveryArgs:UpdateDeliveryInput!){
            updateDelivery(
              data: $updateDeliveryArgs
            )
            {
          id
          distance
          price
            }
          }
      `;  
      const res = await this.client
      .mutate({
        mutation:mutation,
        variables:{
          updateDeliveryArgs:updateDeliveryArgs
        }
      })
      return res.data.updateDelivery; 
  }

  public async cancelDelivery(id:any, reason:any) {
    const mutation =  gql`
          mutation CancelDelivery($id:String, $reason:String){
        cancelDelivery(id:$id, reason:$reason)
            {
          id
            }
          }
      `;  
      const res = await this.client
      .mutate({
        mutation:mutation,
        variables:{
          id:id,
          reason:reason
        }
      })
      return res.data.cancelDelivery; 
  }

  public async getDelivery(id: any) {
      const query = gql`
          query Delivery($id: IDCustomScalar) {
              delivery(id: $id) {
                  ...DeliveryFields
                  __typename
              }
          }

          fragment DeliveryFields on Delivery {
              id
              realId
              trackingId
              externalId
              createdAt
              distance
              price
              estimatedTravelTime
              deliveryMethod
              deliveryMethodDisplayName
              priority
              scheduledAt
              deliveredAt
              receivedBy
              images
              isCurrentUserAuthorizedToModify
              declaredValue
              deliveryServiceProviderQuoteId
              parentDeliveryId
              childDeliveryId
              deliveryMeta {
                  dropoffNote
                  pickupNote
                  poNumber
                  orderNumber
                  bolNumber
                  originCustomAddressLine2
                  destinationCustomAddressLine2
                  __typename
              }
              attachments {
                  id
                  filename
                  url
                  isDeleted
                  isInternal
                  __typename
              }
              deliveryStatus {
                  name
                  code
                  __typename
              }
              origin {
                  id
                  name
                  addressLine1
                  addressLine2
                  city
                  state
                  postalCode
                  latitude
                  longitude
                  zipCodeData {
                      timezone
                      __typename
                  }
                  __typename
              }
              destination {
                  id
                  name
                  addressLine1
                  addressLine2
                  city
                  state
                  postalCode
                  latitude
                  longitude
                  zipCodeData {
                      timezone
                      __typename
                  }
                  __typename
              }
              originatingUser {
                  id
                  externalId
                  emailAddress
                  firstName
                  lastName
                  phoneNumber
                  profileImageUrl
                  walletBalance
                  __typename
              }
              driver {
                  id
                  firstName
                  lastName
                  lastKnownLocation {
                      driverId
                      latitude
                      longitude
                      heading
                      __typename
                  }
                  ratings {
                      average
                      count
                      __typename
                  }
                  __typename
              }
              invoice {
                  subtotal
                  appliedCreditAmount
                  total
                  __typename
              }
              pickupContact {
                  name
                  phoneNumber
                  company
                  emailAddress
                  __typename
              }
              dropoffContact {
                  name
                  phoneNumber
                  company
                  emailAddress
                  __typename
              }
              deliveryDriverReviews {
                  customerRating
                  customerReview
                  __typename
              }
              deliveryUnfulfilledReason {
                  code
                  __typename
              }
              customerRating
              customerReview
              manifestItems {
                  id
                  height
                  width
                  length
                  weight
                  description
                  value
                  quantity
                  __typename
              }
              __typename
          }
      `;

      const res = await this.client.query({
          query: query,
          variables: {
              id: id
          }
      });
      if (res.errors && res.errors.length) {
          throw res.errors[0];
      } else {
          return res.data.delivery;
      }
  }

  public async listDeliveries() {
    const query = gql`
          query {
          deliveries {
            id
            createdAt
            distance
            price
            estimatedTravelTime
            deliveryMethod
            deliveredAt
            deliveryMeta {
              dropoffNote
              pickupNote
              poNumber
              orderNumber
            }
            deliveryStatus {
              name
              code
            }
            origin {
              name
              addressLine1
              addressLine2
              city
              state
              postalCode
              latitude
              longitude
            }
            destination {
              name
              addressLine1
              addressLine2
              city
              state
              postalCode
              latitude
              longitude
            }
            driver {
              firstName
              lastName
              phoneNumber
              profileImageUrl
            }
            images
          }             
          }`;

      const res = await this.client.query({
        query:query
      })

      return res.data.deliveries;
  }

  public async deliveryEstimates(id:any) {
    const query =  gql`
          query DeliveryEstimates($id:String!){
            deliveryEstimates(deliveryId:$id)
            {
            createdAt
            driverLocationLastUpdatedAt
            driverLatitude
            driverLongitude
            address {
              addressLine1
              addressLine2
              city
              state
              postalCode
            }
            distance
            bestGuessEstimate
            estimateType
            }
          }
        `;
    const res = await this.client
    .query({
        query:query,
        variables:{
          id:id
        }
    })
    return res.data.deliveryEstimates;
  } 

  public async deliveryDerivedEstimate(originLocation:any, selectedDeliveryMethod:any) {
    const query =  gql`
          query DeliveryDerivedEstimatesCalculate($originLocation:DeliveryDerivedEstimateOriginLocationInput!, $selectedDeliveryMethod:String!){
            deliveryDerivedEstimatesCalculate(originLocation:$originLocation, selectedDeliveryMethod:$selectedDeliveryMethod)
            {
              estimateInSeconds
            }
          }
        `;
    const res = await this.client
    .query({
        query:query,
        variables:{
          originLocation:originLocation,
          selectedDeliveryMethod:selectedDeliveryMethod
        }
    })
    return res.data.deliveryDerivedEstimatesCalculate;
  }

  public async getCurrentUser() {
    const res = await this.client
      .query({
        query: gql`
          {
            currentUser {
              id
            }
          }
        `
      })

      if(res.data.currentUser.id) {
        this.currentUser = res.data.currentUser;
        return this.currentUser;
      }else{ 
        throw new Error('We were unable to authenticate you');
      }
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
     
