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

  const needsBody = selectedFields.body && logSource === "eventBus";

  const lines: string[] = [`fields ${fieldsList.join(", ")}`];

  if (logSource === "eventBus") {
    lines.push(`| filter @message like /EVENT:/`);

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
    if (activeBodyFilters.length > 0 || needsBody) {
      lines.push(
        `| parse @message /"body"\\s*:\\s*(?<body>\\{.+)/`
      );
      for (const f of activeBodyFilters) {
        const escapedKey = escapeRegexLiteral(f.key.trim());
        const escapedValue = escapeRegexLiteral(f.value.trim());
        const pattern = buildFilterRegex(escapedKey, escapedValue, f.operator, f.dataType);
        lines.push(`| filter body like /${pattern}/`);
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

  return lines.join("\n");
}
