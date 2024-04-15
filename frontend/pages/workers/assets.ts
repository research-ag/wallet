/* eslint-disable no-restricted-globals */

self.onmessage = (event: MessageEvent<string>) => {
  // Log the message received from the main thread
  console.log("Worker received message:", event.data);

  setTimeout(() => {
    const response = `Hello from worker! You said: ${event.data}`;
    // Send a message back to the main thread
    self.postMessage(response);
  }, 2 * 1000);

};
