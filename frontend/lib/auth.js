export const saveAuth = (token, user) => {
  localStorage.setItem('ttmToken', token);
  localStorage.setItem('ttmUser', JSON.stringify(user));
};
export const getUser = () => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('ttmUser');
  if (!raw) return null;
  const user = JSON.parse(raw);
  if (user.email === 'dakshikac2004chaudhary@gmail.com') user.role = 'Admin';
  return user;
};
export const logout = () => {
  localStorage.removeItem('ttmToken');
  localStorage.removeItem('ttmUser');
  window.location.href = '/login';
};
