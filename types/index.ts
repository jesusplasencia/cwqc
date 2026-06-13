export type ValueDataType = "string" | "number";
export type BodyFormat = "json" | "xml";

export const MAX_BODY_FILTERS = 2;

export interface MessageFilter {
  id: string;
  key: string;
  value: string;
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
