export const filterBody = (
  user: Record<string, any>,
  ...allowedFields: string[]
) => {
  const res: Record<string, any> = {};

  Object.keys(user).forEach((el) => {
    if (allowedFields.includes(el)) {
      res[el] = user[el];
    }
  });

  return res;
};
