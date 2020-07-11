<?php

function graphql_query(string $endpoint, string $query, array $variables = [], ?string $token = null): array
{
  $headers = ['Content-Type: application/json', 'User-Agent: Curri PHP Client'];
  if (null !== $token) {
    $headers[] = "authorization: Basic $token";
  }

  if (false === $data = @file_get_contents($endpoint, false, stream_context_create([
    'http' => [
      'method' => 'POST',
      'header' => $headers,
      'content' => json_encode(['query' => $query, 'variables' => $variables]),
    ],
    "ssl" => [
      "verify_peer"=>false,
      "verify_peer_name"=>false,
    ],
  ]))) {
    $error = error_get_last();
    throw new \ErrorException($error['message'], $error['type']);
  }

  return json_decode($data, true);
}