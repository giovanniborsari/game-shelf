export const saveToken = (token: string) => {
  localStorage.setItem("token", token);
  localStorage.setItem("token_created", Date.now().toString());
};

export const getToken = (): string | null => {
  const token = localStorage.getItem("token");
  const created = localStorage.getItem("token_created");

  if (!token || !created) return null;

  const loginTime = 100000; // same time in auth_handler.py
  const age = Date.now() - Number(created);

  if (age > loginTime) {
    clearToken();
    return null;
  }

  return token;
};

export const clearToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("token_created");
};