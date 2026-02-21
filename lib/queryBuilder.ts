import type { LogSource, MessageFilter, EventBusFilterValues, SelectedFields } from "@/types";

export function escapeRegexLiteral(str: string): string {
  return str.replace(/[\\^$.|?*+()[\]{}\/]/g, "\\$&");
}

function buildFilterRegex(escapedKey: string, escapedValue: string, operator: string, dataType: string): string {
  if (dataType === "number") {
    if (operator === "exact") {
      return `"${escapedKey}"\\s*:\\s*${escapedValue}`;
    }
    // contains
    return `"${escapedKey}"\\s*:\\s*\\d*${escapedValue}`;
  }
  // string
  if (operator === "exact") {
    return `"${escapedKey}"\\s*:\\s*"${escapedValue}"`;
  }
  // contains
  return `"${escapedKey}"\\s*:\\s*"0*${escapedValue}"`;
}

interface BuildQueryParams {
  logSource: LogSource;
  eventBusFilters: EventBusFilterValues;
  messageFilters: MessageFilter[];
  selectedFields: SelectedFields;
}

export function buildQuery({
  logSource,
  eventBusFilters,
  messageFilters,
  selectedFields,
}: BuildQueryParams): string {
  const fieldsList: string[] = [];
  if (selectedFields.timestamp) fieldsList.push("@timestamp");
  if (selectedFields.logStream) fieldsList.push("@logStream");
  if (selectedFields.message) fieldsList.push("@message");

  const needsDetail = selectedFields.detail && logSource === "eventBus";

  const lines: string[] = [];
  if (fieldsList.length > 0) {
    lines.push(`fields ${fieldsList.join(", ")}`);
  }

  if (logSource === "eventBus") {

    if (eventBusFilters.source.trim()) {
      const escaped = escapeRegexLiteral(eventBusFilters.source.trim());
      lines.push(
        `| filter @message like /"source"\\s*:\\s*"${escaped}"/`
      );
    }
    if (eventBusFilters.detailType.trim()) {
      const escaped = escapeRegexLiteral(eventBusFilters.detailType.trim());
      lines.push(
        `| filter @message like /"detail-type"\\s*:\\s*"${escaped}"/`
      );
    }

    const activeBodyFilters = messageFilters.filter(
      (f) => f.key.trim() && f.value.trim()
    );
    if (activeBodyFilters.length > 0 || needsDetail) {
      lines.push(
        `| parse @message /"detail"\\s*:\\s*(?<detail>\\{.+)/`
      );
      for (const f of activeBodyFilters) {
        const escapedKey = escapeRegexLiteral(f.key.trim());
        const escapedValue = escapeRegexLiteral(f.value.trim());
        const pattern = buildFilterRegex(escapedKey, escapedValue, f.operator, f.dataType);
        lines.push(`| filter detail like /${pattern}/`);
      }
    }
  } else {
    for (const f of messageFilters) {
      if (!f.key.trim() || !f.value.trim()) continue;
      const escapedKey = escapeRegexLiteral(f.key.trim());
      const escapedValue = escapeRegexLiteral(f.value.trim());
      const pattern = buildFilterRegex(escapedKey, escapedValue, f.operator, f.dataType);
      lines.push(`| filter @message like /${pattern}/`);
    }
  }

  lines.push("| sort @timestamp desc");
  lines.push("| limit 100");

  // When no `fields` line exists, the first line starts with `| ` — strip it
  if (lines.length > 0 && lines[0].startsWith("| ")) {
    lines[0] = lines[0].slice(2);
  }

  return lines.join("\n");
}
