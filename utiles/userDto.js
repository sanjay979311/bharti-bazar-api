export const userDTO = (user) => {
  return {
    id: user._id,
    name: user.fullName,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    provider: user.provider,
  };
};
