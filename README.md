# `p-flat`

No more callback and try-catch hell.

## Example Usage

```ts
import p from "p-flat";

const [res, err] = await p(someAsyncWork(...args));

if (err) {
  // If `err` is truthy, some error has been thrown
  // `res` will be `null` and should not be accessed/used
  // Error handling for `someAsyncWork` should be done here
  console.error(err);
  return;
}

// Else, `res` will be the correct return value of `someAsyncWork`
console.log(res);
```

**Note:**

- If `err` is truthy (ie. the asynchronous function threw an error), then `res` will be `null`
- If `err` if falsy (ie. the asynchronous function did not throw any errors), then `res` is guaranteed to have the return value of the resolved function
- Due to limitations in TypeScript, `res` will always have the return type of the resolved function, even when `err` is truthy (and thus `res` is `null`)

## Motivation

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
if (randomNumberErr) {
  console.error(randomNumberErr);
  // Uncomment the next line to stop execution
  // return;
}

const [squareNumber, squareNumberErr] = await p(getSquareNumber(randomNumber));
if (squareNumberErr) {
  console.error(squareNumberErr);
  // Uncomment the next line to stop execution
  // return;
}

// Continue execution with `squareNumber`
```
