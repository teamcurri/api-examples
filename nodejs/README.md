# CurriClientService Documentation

The `CurriClientService` class enables interaction with the Curri API, facilitating operations such as fetching delivery quotes, booking deliveries, managing deliveries with multiple stops, retrieving delivery information, estimating delivery times, and canceling deliveries. This README details how to install, configure, and utilize this service in your projects.

## Installation

Ensure Node.js is installed on your system. Include this library in your project using npm or yarn if lib on public registry:

### Using npm

```bash
npm install @your-namespace/curri --save
```

### Using yarn

```bash
yarn add @your-namespace/curri
```

## Configuration

If not on public registry require file manually. Obtain your user ID and API key from your Curri API account. Initialize the `CurriClientService` with these credentials:

```javascript
const { CurriClientService } = require('./dist');
const curri = new CurriClientService({ userID: "********", apiKey: "********" });
```

## Methods

`CurriClientService` provides methods for:

- Booking deliveries
- Booking deliveries with multiple stops
- Fetching delivery quotes
- Fetching quotes for deliveries with multiple stops
- Retrieving delivery information
- Estimating delivery times
- Canceling deliveries

### Examples

#### Booking a Delivery

```javascript
async function bookDelivery() {
  const booking = await curri.book(req.body);
  console.log(booking);
}
```

#### Booking a Delivery with Multiple Stops

```javascript
async function bookMultiDelivery() {
  const bookingMulti = await curri.bookMulti(req.body);
  console.log(bookingMulti);
}
```

#### Fetching a Quote for a Delivery with Multiple Stops

```javascript
async function fetchMultistopQuote() {
  const quoteMulti = await curri.quoteMultistop(req.query);
  console.log(quoteMulti);
}
```

#### Retrieving Delivery Information

```javascript
async function retrieveDelivery() {
  const delivery = await curri.getDelivery(req.query.delivery_id);
  console.log(delivery);
}
```

#### Estimating Delivery Times

```javascript
async function estimateDelivery() {
  const originLocation = {/* Define origin location */};
  const selectedDeliveryMethod = "MethodHere"; // Define delivery method
  const derivedDeliveryEstimate = await curri.deliveryDerivedEstimate(originLocation, selectedDeliveryMethod);
  console.log(derivedDeliveryEstimate);
}
```

#### Canceling a Delivery

```javascript
async function cancelDeliveryAction() {
  const delivery_id = "YourDeliveryIDHere"; // Define delivery ID
  const reason = "YourReasonHere"; // Define cancellation reason
  const cancelDelivery = await curri.cancelDelivery(delivery_id, `Cancel Delivery Reason: ${reason}`);
  console.log(cancelDelivery);
}
```

#### Fetching a Delivery Quote

```javascript
async function fetchQuote() {
  const quote = await curri.quote(req.query);
  console.log(quote);
}
```

## Support

For any issues, questions, or contributions, refer to the project's GitHub repository or directly contact the project maintainers.
```