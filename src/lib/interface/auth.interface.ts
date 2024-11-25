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

export interface InputAgentKYC {
  id?: string;
  nationalIdNo?: string;
  lockNin?: boolean;
  taxIdNo?: string;
  lockTin?: boolean;
  healthIdNo?: string;
  lockHin?: boolean;
  socialSecurityNo?: string;
  lockSsn?: boolean;
}

export interface InputAccountUpdate {
  id?: string;
  passwordCurrent?: string;
  name?: string;
  email?: string;
  phone?: string;
  photoId?: string;
  password?: string;
  passwordConfirmartion?: string;
}
