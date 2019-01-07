/* @flow */

declare type CookieOptions = {
  domain?: string;
  expires?: string;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  secure?: boolean;
  signed?: boolean;
  req?: Request;
  res?: Response;
};
declare class Request {
  hostname: string;
  originalUrl: string;
  cookies: Object;
  signedCookies: Object;
}
declare class Response {
  cookie(name: string, value: string | Object,
    options?: CookieOptions): Response;
  clearCookie(name: string, options?: CookieOptions): Response;
}
