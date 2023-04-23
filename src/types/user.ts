export interface User {
  name: string;
  id: string;
  token?: string | null;
}

export interface LoginInterface {
  email: string;
  password: string;
}

export interface RegisterInterface {
  name: string;
  password: string;
  email: string;
}

export interface ForgotPasswordInterface {
  email: string;
}

export interface ResetPasswordInterface {
  password: string;
  passwordConfirmation: string;
  code: string;
}
