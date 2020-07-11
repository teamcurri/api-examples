<?php

require('./graphql-client.php');

$api_key = 'INSERT_BASE_64_USERID_AND_APIKEY';
$url = 'https://api.curri.com/graphql';

$current_user_query = <<<'GRAPHQL'
query {
  currentUser {
    id
  }
}
GRAPHQL;

$current_user_response = graphql_query($url, $current_user_query, [], $api_key);

$user_id = $current_user_response['data']['currentUser']['id'];

if(!$user_id) {
  throw new Exception('We were unable to authenticate you');
}

print_r("Logged in as: $user_id\n");

$quote_query = <<<'GRAPHQL'
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
GRAPHQL;

$quote_response = graphql_query($url, $quote_query, [], $api_key);
$quote_id = $quote_response['data']['deliveryQuote']['id'];

$book_query = <<<GRAPHQL
mutation {
  bookDelivery(
    data: {
      deliveryQuoteId: "$quote_id"
    }
  ) {
    id
    price
    createdAt
    deliveryMethod
    deliveredAt
  }
}
GRAPHQL;


$book_response = graphql_query($url, $book_query, [], $api_key);
print_r("\nBook Delivery: ");
print_r($book_response);