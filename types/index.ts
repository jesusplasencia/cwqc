export type LogSource = "eventBus" | "queue" | "apiGateway";
export type FilterOperator = "exact" | "contains";
export type ValueDataType = "string" | "number";

export interface MessageFilter {
  id: string;
  key: string;
  value: string;
  operator: FilterOperator;
  dataType: ValueDataType;
}

export interface EventBusFilterValues {
  source: string;
  detailType: string;
}

export interface SelectedFields {
  timestamp: boolean;
  logStream: boolean;
  message: boolean;
  detail: boolean;
}
