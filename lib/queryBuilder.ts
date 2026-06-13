import type {
  MessageFilter,
  EventBusFilterValues,
  SelectedFields,
  BodyFormat,
} from "@/types";

export function escapeRegexLiteral(str: string): string {
  return str.replace(/[\\^$.|?*+()[\]{}\/]/g, "\\$&");
}

// EventBridge serializes envelope keys with inconsistent casing across producers,
// so each envelope field is matched against every variant it can appear as.
const ENVELOPE_SOURCE = `"[Ss]ource"`;
const ENVELOPE_DETAIL_TYPE = `"(?:detail-type|DetailType)"`;
const ENVELOPE_DETAIL = `"(?:detail|Detail)"`;

// Body filters match the same key/value pair whether the payload is JSON or XML,
// always as an exact match. The key is always a string; only the value's type
// (string/number) varies, and it only affects JSON (XML carries values as text).
function buildFilterRegex(
  escapedKey: string,
  escapedValue: string,
  dataType: string,
  bodyFormat: BodyFormat
): string {
  if (bodyFormat === "xml") {
    // Tolerate namespace prefixes (ns:key) and tag attributes (<key attr="...">).
    // The closing `/` must be escaped — CloudWatch delimits the regex with /.../.
    return `<(?:\\w+:)?${escapedKey}(?:\\s[^>]*)?>\\s*${escapedValue}\\s*<\\/`;
  }

  // JSON
  if (dataType === "number") {
    return `"${escapedKey}"\\s*:\\s*${escapedValue}`;
  }
  return `"${escapedKey}"\\s*:\\s*"${escapedValue}"`;
}

interface BuildQueryParams {
  eventBusFilters: EventBusFilterValues;
  messageFilters: MessageFilter[];
  selectedFields: SelectedFields;
  bodyFormat: BodyFormat;
}

export function buildQuery({
  eventBusFilters,
  messageFilters,
  selectedFields,
  bodyFormat,
}: BuildQueryParams): string {
  const fieldsList: string[] = [];
  if (selectedFields.timestamp) fieldsList.push("@timestamp");
  if (selectedFields.logStream) fieldsList.push("@logStream");
  if (selectedFields.message) fieldsList.push("@message");

  const lines: string[] = [];
  if (fieldsList.length > 0) {
    lines.push(`fields ${fieldsList.join(", ")}`);
  }

  if (eventBusFilters.source.trim()) {
    const escaped = escapeRegexLiteral(eventBusFilters.source.trim());
    lines.push(`| filter @message like /${ENVELOPE_SOURCE}\\s*:\\s*"${escaped}"/`);
  }
  if (eventBusFilters.detailType.trim()) {
    const escaped = escapeRegexLiteral(eventBusFilters.detailType.trim());
    lines.push(`| filter @message like /${ENVELOPE_DETAIL_TYPE}\\s*:\\s*"${escaped}"/`);
  }

  // `detail` is only extracted when the user wants it as an output column.
  if (selectedFields.detail) {
    lines.push(`| parse @message /${ENVELOPE_DETAIL}\\s*:\\s*(?<detail>\\{.+)/`);
  }

  // Body filters run against @message for both JSON and XML, decoupled from the
  // detail extraction above.
  for (const f of messageFilters) {
    if (!f.key.trim() || !f.value.trim()) continue;
    const escapedKey = escapeRegexLiteral(f.key.trim());
    const escapedValue = escapeRegexLiteral(f.value.trim());
    const pattern = buildFilterRegex(escapedKey, escapedValue, f.dataType, bodyFormat);
    lines.push(`| filter @message like /${pattern}/`);
  }

  lines.push("| sort @timestamp desc");
  lines.push("| limit 100");

  // When no `fields` line exists, the first line starts with `| ` — strip it
  if (lines.length > 0 && lines[0].startsWith("| ")) {
    lines[0] = lines[0].slice(2);
  }

  return lines.join("\n");
}
