export const typeDefs = ["type HelloResponse {\r\n  result: String\r\n}\r\n\r\ntype Query {\r\n  Hello(name: String): HelloResponse!\r\n}\r\n"];
/* tslint:disable */

export interface Query {
  Hello: HelloResponse;
}

export interface HelloQueryArgs {
  name: string | null;
}

export interface HelloResponse {
  result: string | null;
}
