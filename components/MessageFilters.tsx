import type { MessageFilter, FilterOperator } from "@/types";

interface MessageFiltersProps {
  filters: MessageFilter[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof MessageFilter, value: string) => void;
}

export default function MessageFilters({
  filters,
  onAdd,
  onRemove,
  onUpdate,
}: MessageFiltersProps) {
  return (
    <div>
      <div className="panel-title">Message Filters</div>
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
              <input
                type="text"
                placeholder="Value"
                value={f.value}
                onChange={(e) => onUpdate(f.id, "value", e.target.value)}
              />
              <select
                value={f.operator}
                onChange={(e) =>
                  onUpdate(f.id, "operator", e.target.value as FilterOperator)
                }
                aria-label="Operator"
              >
                <option value="exact">= exact</option>
                <option value="contains">% contains</option>
              </select>
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
      <button type="button" className="btn-primary" onClick={onAdd}>
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
    </div>
  );
}
