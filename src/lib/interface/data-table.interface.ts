import type { Dispatch, SetStateAction } from 'react';
import type { ApolloQueryResult } from '@apollo/client';

export interface IDataTable {
  columns: any[];
  loading: boolean;
  data: any[];
  totalRows: number;
  tableExpansion?: any;
  handleReloadMutation?: (pageSize: number, page?: number) => void;
  handleReloadQuery?: (
    variables?: Partial<any>
  ) => Promise<ApolloQueryResult<any>>;
  reloadQueryFilter?: Object;
  setSelected?: Dispatch<SetStateAction<string[]>>;
  dense?: boolean;
  actions?: React.ReactNode | React.ReactNode[];
  reloadTriggers?: any[];
  expanded?: boolean;
  selectable?: boolean;
  fixedHeader?: boolean;
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
}
