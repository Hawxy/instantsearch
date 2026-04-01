export const createFakeClient = () => ({
  search: jest.fn(
    (requests: Array<{ params: { query: string } }>) =>
      Promise.resolve({
        results: requests.map(({ params: { query } }) => ({ query })),
      })
  ),
});
