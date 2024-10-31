export interface InputSignUp {
  name?: string;
  phone?: string;
  email?: string;
}

export interface InputReset {
  token?: string;
  password?: string;
  passwordConfirmartion?: string;
}

export interface InputLogin {
  keyPublic?: string;
  keyPrivate?: string;
}
