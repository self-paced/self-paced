import bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

export const comparePasswords = async (plainPass: string, hashPass: string) => {
  return await bcrypt.compare(plainPass, hashPass);
};
