export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  // token_type: string;
}


export interface SignUpResponse extends TokenResponse {
  error?: string;
  status: string;
}

export interface GetUsernameByUserIdResponse {
  username: string
}
