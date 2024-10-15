declare module "xss-clean" {
  import { RequestHandler } from "express";

  /**
   * xss-clean middleware type definition.
   *
   * Can be used as an Express middleware to sanitize user input from
   * request bodies, query parameters, and other sources to prevent XSS attacks.
   *
   * @returns An Express request handler that sanitizes inputs.
   */
  function xssClean(): RequestHandler;

  export = xssClean;
}
