export interface User {
  name: string;
  id: string;
  token?: string | null;
  email?: string;
  isConfirmed?: boolean;
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

export interface ChangePasswordDTO {
  newPassword: string;
  oldPassword: string;
}

export interface ChangePasswordFormInterface {
  newPassword: string;
  oldPassword: string;
  passwordConfirmation: string;
}
