const createRandomPassword = () => {

  const upperCaseLetter = String.fromCharCode(Math.ceil(Math.random() * 26) + 64);
  const lowerCaseLetter = String.fromCharCode(Math.ceil(Math.random() * 26) + 96);
  const randomPassword = `${upperCaseLetter}${lowerCaseLetter}${Date.now()}`;

  return randomPassword;
};

export default createRandomPassword;