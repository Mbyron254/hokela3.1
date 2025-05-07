import { ApolloQueryResult } from '@apollo/client';
import { Dispatch, SetStateAction } from 'react';

export interface IDataTable {
  columns: any[];
  loading: boolean;
  data: any[];
  totalRows: number;
  tableExpansion?: any;
  handleReloadMutation?: (page?: number, pageSize?: number) => void;
  handleReloadQuery?: (variables?: Partial<any>) => Promise<ApolloQueryResult<any>>;
  reloadQueryFilter?: Object;
  setSelected?: Dispatch<SetStateAction<string[]>>;
  dense?: boolean;
  actions?: React.ReactNode | React.ReactNode[];
  reloadTriggers?: any[];
  expanded?: boolean;
  selectable?: boolean;
  fixedHeader?: boolean;
  selectorParent1?: string;
}

export interface IDataTableStatic {
  columns: any[];
  loading: boolean;
  data: any[];
  tableExpansion?: any;
  setSelected?: Dispatch<SetStateAction<string[]>>;
  selectable?: boolean;
  dense?: boolean;
  fixedHeader?: boolean;
  selectorParent1?: string;
}
