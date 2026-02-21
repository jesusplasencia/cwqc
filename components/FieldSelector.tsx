import type { SelectedFields } from "@/types";

interface FieldSelectorProps {
  selectedFields: SelectedFields;
  onChange: (fields: SelectedFields) => void;
  showDetail: boolean;
}

const FIELD_LABELS: { key: keyof SelectedFields; label: string }[] = [
  { key: "timestamp", label: "@timestamp" },
  { key: "logStream", label: "@logStream" },
  { key: "message", label: "@message" },
  { key: "detail", label: "detail" },
];

export default function FieldSelector({
  selectedFields,
  onChange,
  showDetail,
}: FieldSelectorProps) {
  const checkedCount = Object.values(selectedFields).filter(Boolean).length;

  const toggle = (key: keyof SelectedFields) => {
    onChange({ ...selectedFields, [key]: !selectedFields[key] });
  };

  const fields = showDetail
    ? FIELD_LABELS
    : FIELD_LABELS.filter((f) => f.key !== "detail");

  return (
    <div>
      <div className="panel-title">Fields</div>
      <div className="field-checkboxes">
        {fields.map((f) => (
          <label key={f.key} className="checkbox-label">
            <input
              type="checkbox"
              checked={selectedFields[f.key]}
              disabled={selectedFields[f.key] && checkedCount === 1}
              onChange={() => toggle(f.key)}
            />
            {f.label}
          </label>
        ))}
      </div>
    </div>
  );
}
