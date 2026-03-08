declare module "@react-oauth/google" {
  import type { FC } from "react";
  // basic React component types with unknown props to avoid `any` lint errors
  export const GoogleOAuthProvider: FC<unknown>;
  export const GoogleLogin: FC<unknown>;
  export type CredentialResponse = {
    credential: string;
    select_by: string;
  };
  // …etc
}
