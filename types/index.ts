export type LogSource = "eventBus" | "queue" | "apiGateway";
export type FilterOperator = "exact" | "contains";

export interface MessageFilter {
  id: string;
  key: string;
  value: string;
  operator: FilterOperator;
}

export interface EventBusFilterValues {
  source: string;
  detailType: string;
}
