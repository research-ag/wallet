export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export enum ServerStateKeys {
  allowances = "allowances",
}

export interface ValidationErrors {
  message: string;
  field: string;
}
