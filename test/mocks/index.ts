export const mockedErrorResponse = expect.objectContaining({
  statusCode: expect.any(Number),
  message: expect.any(String),
  error: expect.any(String),
});

export const mockedRequiredFieldsResponse = expect.objectContaining({
  statusCode: expect.any(Number),
  message: expect.arrayContaining([expect.any(String)]),
  error: expect.any(String),
});
