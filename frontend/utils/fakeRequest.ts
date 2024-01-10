export default function fakeRequest<TData>(request: () => TData, delay = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(request());
    }, delay);
  });
}
