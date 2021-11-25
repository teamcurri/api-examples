using System;
using System.Text.Json;
using System.Threading.Tasks;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.Newtonsoft;

namespace CurriAPI.Example
{

    class Program
    {

        public static async Task Main(string[] args)
        {
            var apiKey = "INSERT_BASE_64_USERID_AND_APIKEY";
            var apiHost = "https://api.curri.com/graphql";
            var graphQLClient = new GraphQL.Client.Http.GraphQLHttpClient(apiHost, new NewtonsoftJsonSerializer());

            graphQLClient.HttpClient.DefaultRequestHeaders.Add("authorization", $"Basic ${apiKey}");

            var currentUserRequest = new GraphQLHttpRequest
            {
                Query = @"
                {
                    currentUser {
                        id
                        firstName
                        lastName
                    }
                }"
            };

            var currentUserResponse = await graphQLClient.SendQueryAsync<object>(currentUserRequest);
            Console.WriteLine();
            Console.WriteLine($"Current User: {currentUserResponse.Data.ToString()}");


            var quoteRequest = new GraphQLHttpRequest
            {
                Query = @"
                query DeliveryQuote ($origin: AddressInput, $destination: AddressInput, $deliveryMethod: String){
                    deliveryQuote (
                        destination: $destination
                        origin: $origin,
                        deliveryMethod: $deliveryMethod
                    ) {
                        id
                        fee
                        distance
                        duration
                        pickupDuration
                        deliveryMethod
                    }
                }",

                OperationName = "DeliveryQuote",
                Variables = new
                {
                    deliveryMethod = "truck",
                    destination = new {
                        name = "Curri Incubator",
                        addressLine1 = "218 College Ave",
                        city =  "Mountain View",
                        state = "CA",
                        postalCode = 93001
                    },
                    origin = new
                    {
                        name= "305 South Kalorama Street",
                        addressLine1 = "305 S Kalorama St",
                        city = "Ventura",
                        state = "CA",
                        postalCode = 93001
                    }
                }
            };


            var quoteResponse = await graphQLClient.SendQueryAsync<DeliveryQuoteResponse>(quoteRequest);

            Console.WriteLine();
            Console.WriteLine($"Truck Quote: {quoteResponse.Data.ToString()}");


            var quoteId = quoteResponse.Data.DeliveryQuote.Id;
            Console.WriteLine($"Quote ID: {quoteResponse.Data.DeliveryQuote.Id}");

            var bookRequest = new GraphQLHttpRequest
            {
                Query = @"
                mutation BookDelivery ($data: BookDeliveryInput!){
                    bookDelivery (
                        data: $data
                    ) {
                        id
                        price
                        createdAt
                        deliveryMethod
                        deliveredAt
                    }
                }",

                OperationName = "BookDelivery",
                Variables = new
                {
                    data = new
                    {
                        deliveryQuoteId = quoteResponse.Data.DeliveryQuote.Id
                    }
                }
            };

            var bookResponse = await graphQLClient.SendQueryAsync<object>(bookRequest);

            Console.WriteLine();
            Console.WriteLine($"Book Delivery: {bookResponse.Data.ToString()}");
        }
    }
}
