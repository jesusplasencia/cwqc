import type { MessageFilter, ValueDataType, BodyFormat } from "@/types";
import { MAX_BODY_FILTERS } from "@/types";

interface MessageFiltersProps {
  filters: MessageFilter[];
  bodyFormat: BodyFormat;
  onBodyFormatChange: (format: BodyFormat) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof MessageFilter, value: string) => void;
}

export default function MessageFilters({
  filters,
  bodyFormat,
  onBodyFormatChange,
  onAdd,
  onRemove,
  onUpdate,
}: MessageFiltersProps) {
  const atLimit = filters.length >= MAX_BODY_FILTERS;

  return (
    <div>
      <div className="panel-header">
        <div className="panel-title">Message Filters</div>
        <div className="segmented" role="group" aria-label="Body format">
          {(["json", "xml"] as const).map((fmt) => (
            <button
              key={fmt}
              type="button"
              className={`segmented-btn${bodyFormat === fmt ? " is-active" : ""}`}
              aria-pressed={bodyFormat === fmt}
              onClick={() => onBodyFormatChange(fmt)}
            >
              {fmt.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      {filters.length > 0 && (
        <div className="filters-list">
          {filters.map((f) => (
            <div key={f.id} className="filter-row">
              <input
                type="text"
                placeholder="Key"
                value={f.key}
                onChange={(e) => onUpdate(f.id, "key", e.target.value)}
              />
              <span className="op-eq" aria-hidden="true">=</span>
              <select
                value={f.dataType}
                onChange={(e) =>
                  onUpdate(f.id, "dataType", e.target.value as ValueDataType)
                }
                aria-label="Data type"
              >
                <option value="string">string</option>
                <option value="number">number</option>
              </select>
              <input
                type="text"
                placeholder="Value"
                value={f.value}
                onChange={(e) => onUpdate(f.id, "value", e.target.value)}
                {...(f.dataType === "number"
                  ? { inputMode: "numeric" as const, pattern: "[0-9]*" }
                  : {})}
              />
              <button
                type="button"
                className="btn-icon"
                onClick={() => onRemove(f.id)}
                aria-label="Remove filter"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        className="btn-primary"
        onClick={onAdd}
        disabled={atLimit}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add Filter
      </button>
      {atLimit && (
        <p className="filter-hint">Máximo {MAX_BODY_FILTERS} atributos combinados</p>
      )}
    </div>
  );
}
