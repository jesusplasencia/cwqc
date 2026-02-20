import type { LogSource, MessageFilter, EventBusFilterValues } from "@/types";

export function escapeRegexLiteral(str: string): string {
  return str.replace(/[\\^$.|?*+()[\]{}\/]/g, "\\$&");
}

interface BuildQueryParams {
  logSource: LogSource;
  eventBusFilters: EventBusFilterValues;
  messageFilters: MessageFilter[];
}

export function buildQuery({
  logSource,
  eventBusFilters,
  messageFilters,
}: BuildQueryParams): string {
  const lines: string[] = ["fields @timestamp, @logStream, @message"];

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
  }

  for (const f of messageFilters) {
    if (!f.key.trim() || !f.value.trim()) continue;
    const escapedKey = escapeRegexLiteral(f.key.trim());
    const escapedValue = escapeRegexLiteral(f.value.trim());

    if (f.operator === "exact") {
      lines.push(
        `| filter @message like /"${escapedKey}"\\s*:\\s*"${escapedValue}"/`
      );
    } else {
      lines.push(
        `| filter @message like /"${escapedKey}"\\s*:\\s*"[^"]*${escapedValue}[^"]*"/`
      );
    }
  }

  lines.push("| sort @timestamp desc");
  lines.push("| limit 100");

  return lines.join("\n");
}
