export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export enum ServerStateKeys {
  allowances = "allowances",
}

export interface Errors {
  message: string;
  field: string;
}
