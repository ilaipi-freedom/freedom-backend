export class AuthSessionKey {
  type: string;
  key: string;
  id: string;
}

export class AuthSession {
  id: string;
  username: string;
  token: string;
  role: string;
}
