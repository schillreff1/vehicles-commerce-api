export const mockedValidLoginBody = {
  email: 'teste@gmail.com',
  password: '1234',
};

export const mockedInvalidLoginBody = (mock: string) => {
  if (mock === 'e-mail') {
    return {
      email: 'naoTeste@gmail.com',
      password: '1234',
    };
  }

  return {
    email: 'teste@gmail.com',
    password: '4321',
  };
};

export const mockedToken = expect.objectContaining({
  token: expect.any(String),
});
