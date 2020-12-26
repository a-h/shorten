export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Url = {
  __typename?: 'URL';
  id: Scalars['ID'];
  short: Scalars['String'];
  long: Scalars['String'];
  count: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  getUrl?: Maybe<Array<Url>>;
};


export type QueryGetUrlArgs = {
  id: Scalars['ID'];
};

export type ShortenInput = {
  url: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  shorten: Url;
};


export type MutationShortenArgs = {
  input: ShortenInput;
};
