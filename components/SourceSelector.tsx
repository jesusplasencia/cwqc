import type { LogSource } from "@/types";

interface SourceSelectorProps {
  value: LogSource;
  onChange: (source: LogSource) => void;
}

export default function SourceSelector({ value, onChange }: SourceSelectorProps) {
  return (
    <div className="field-group">
      <label htmlFor="log-source">Log Source</label>
      <select
        id="log-source"
        value={value}
        onChange={(e) => onChange(e.target.value as LogSource)}
      >
        <option value="eventBus">Event Bus</option>
        <option value="queue">Queue</option>
        <option value="apiGateway">API Gateway</option>
      </select>
    </div>
  );
}
