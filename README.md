# `p-flat`

Go inspired error handling for asynchronous functions.

## Installation

```sh
npm install p-flat

yarn add p-flat

pnpm add p-flat
```

## Example Usage

```ts
import p from "p-flat";

const [res, err] = await p(someAsyncWork(...args));

if (err !== null) {
  // If `err` is not `null`, some error or value has been thrown
  // `res` will be `null` and cannot be used safely here
  // Error handling for `someAsyncWork` should be done here
  console.error(err);
  return;
}

// Else, `res` will be the correct return type and value of `someAsyncWork`
console.log(res);
```

- If `err` is not `null` (ie. the asynchronous function threw an error), then `res` will be `null`
- If `err` is `null` (ie. the asynchronous function did not throw any errors), then `res` is guaranteed to have the return type and value of the resolved function

## Rationale

Inspired from the [error handling in Go](https://blog.golang.org/error-handling-and-go), this construct greatly increases code readability.

As an example, let's say we have these two asynchronous function:

```ts
async function getRandomNumber(): Promise<number> {
  const randomNumber = await api.random();
  return randomNumber;
}

async function getSquareNumber(x: number): Promise<number> {
  const squareNumber = await api.square(x);
  return squareNumber;
}
```

Assume `api` is a class which handles asynchronous API calls to an external service which may occasionally throw an error. If we first want to get a random number, followed by getting the square of it, we can do the following without any error handling:

```ts
const randomNumber = await getRandomNumber();
const squareNumber = await getSquareNumber(randomNumber);
// Continue execution with `squareNumber`
```

If we want to handle the errors separately, two different try-catch blocks must be added:

```ts
let randomNumber: number;
try {
  randomNumber = await getRandomNumber();
} catch (error) {
  console.error(error);
}

let squareNumber: number;
try {
  squareNumber = await getSquareNumber(randomNumber);
} catch (error) {
  console.error(error);
}

// Continue execution with `squareNumber`
```

Or alternatively, with callbacks:

```ts
const randomNumber = await getRandomNumber().catch(
  (error) => console.error
);
const squareNumber = await getSquareNumber(randomNumber).catch(
  (error) => console.error
);

// Continue execution with `squareNumber`
```

Both implementations are less than ideal. The try-catch version is excessively verbose and requires the use of the mutable `let` declarations. The callback version, though more concise, has no elegant way to stop execution if the asynchronous functions throw any errors.

With `p-flat`:

```ts
const [randomNumber, randomNumberErr] = await p(getRandomNumber());
if (randomNumberErr !== null) {
  console.error(randomNumberErr);
  // Uncomment the next line to stop execution
  // return;
}

const [squareNumber, squareNumberErr] = await p(getSquareNumber(randomNumber));
if (squareNumberErr !== null) {
  console.error(squareNumberErr);
  // Uncomment the next line to stop execution
  // return;
}

// Continue execution with `squareNumber`
```
