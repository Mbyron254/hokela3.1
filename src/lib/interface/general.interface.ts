import {
  ApolloQueryResult,
  OperationVariables,
  TypedDocumentNode,
} from '@apollo/client';
import { DocumentNode } from 'graphql';
import { Dispatch, MouseEventHandler, SetStateAction } from 'react';

export interface IGQLQuery {
  refetch: (variables?: Partial<any>) => Promise<ApolloQueryResult<any>>;
  loading: boolean;
  data?: any;
}

export interface IGQLMutation {
  action: Function;
  loading: boolean;
  data?: any;
}

export interface InputGQLMutation {
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>;
  resolver: string;
  toastmsg?: boolean;
  callback?: Function;
}

export interface InputGQLQuery {
  query: DocumentNode | TypedDocumentNode<any, OperationVariables>;
  queryAction: string;
  variables?: OperationVariables;
}

export interface IMutationButton {
  label?: string;
  icon: string;
  loading: boolean;
  outline?: boolean;
  disable?: boolean;
  className?: string;
  btntype?: string;
  size?: 'xl' | 'lg' | 'md' | 'sm' | undefined;
  type?: 'button' | 'submit' | 'reset' | undefined;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
}

export interface TState {
  theme: string;
  label: string;
}

export interface PageTitleNavigation {
  title: string;
  path?: string;
}

export interface ISelectMultiple {
  checkbox: boolean;
  asset: string;
  allOptions: never[];
  options: never[];
  selected: never[];
  disablePreselected: boolean;
  disable?: boolean;
  displayValue?: string;
  setOptions: (data: any) => void;
  setSelected: (data: any) => void;
}

export interface ISelectSingle {
  options: any[];
  isLoading?: boolean;
  placeholder?: string;
  onChange: Dispatch<SetStateAction<any>>;
}

export interface ISelectSingleOption {
  id: string | null;
  name?: string;
}

export interface T_Option {
  label: string;
  value?: any;
}

export interface IPhoneNumberInput {
  input: any;
  phonekey: string;
  onChange: (value: SetStateAction<any>) => void;
  required?: boolean;
}

export interface IWYSIWYG {
  value: string | undefined;
  placeholder: string;
  defaultValue?: string;
  height?: string;
  limited?: boolean;
  setValue: (value: string) => void;
}
