import type { EventBusFilterValues } from "@/types";

interface EventBusFiltersProps {
  values: EventBusFilterValues;
  onChange: (values: EventBusFilterValues) => void;
}

export default function EventBusFilters({ values, onChange }: EventBusFiltersProps) {
  return (
    <>
      <div className="field-group">
        <label htmlFor="eb-source">Source</label>
        <input
          id="eb-source"
          type="text"
          placeholder="e.g. my-service"
          value={values.source}
          onChange={(e) => onChange({ ...values, source: e.target.value })}
        />
      </div>
      <div className="field-group">
        <label htmlFor="eb-detail-type">Detail-type</label>
        <input
          id="eb-detail-type"
          type="text"
          placeholder="e.g. OrderCreated"
          value={values.detailType}
          onChange={(e) => onChange({ ...values, detailType: e.target.value })}
        />
      </div>
    </>
  );
}
