"use client";

import { useState, useMemo, useCallback } from "react";
import type { LogSource, MessageFilter, EventBusFilterValues, SelectedFields } from "@/types";
import { buildQuery } from "@/lib/queryBuilder";
import SourceSelector from "@/components/SourceSelector";
import EventBusFilters from "@/components/EventBusFilters";
import MessageFilters from "@/components/MessageFilters";
import FieldSelector from "@/components/FieldSelector";
import QueryOutput from "@/components/QueryOutput";

const SOURCE_LABELS: Record<LogSource, string> = {
  eventBus: "Event Bus",
  queue: "Queue",
  apiGateway: "API Gateway",
};

export default function Home() {
  const [logSource, setLogSource] = useState<LogSource>("eventBus");
  const [eventBusFilters, setEventBusFilters] = useState<EventBusFilterValues>({
    source: "",
    detailType: "",
  });
  const [messageFilters, setMessageFilters] = useState<MessageFilter[]>([]);
  const [selectedFields, setSelectedFields] = useState<SelectedFields>({
    timestamp: true,
    logStream: true,
    message: true,
    body: false,
  });

  const query = useMemo(
    () => buildQuery({ logSource, eventBusFilters, messageFilters, selectedFields }),
    [logSource, eventBusFilters, messageFilters, selectedFields]
  );

  const addFilter = useCallback(() => {
    setMessageFilters((prev) => [
      ...prev,
      { id: crypto.randomUUID(), key: "", value: "", operator: "exact", dataType: "string" },
    ]);
  }, []);

  const removeFilter = useCallback((id: string) => {
    setMessageFilters((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const updateFilter = useCallback(
    (id: string, field: keyof MessageFilter, value: string) => {
      setMessageFilters((prev) =>
        prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
      );
    },
    []
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">CloudWatch Query Crafter</h1>
        <p>
          Craft CloudWatch Logs Insights queries visually and copy them
          instantly.
        </p>
      </header>

      <div className="main-grid">
        <div className="panel">
          <SourceSelector value={logSource} onChange={setLogSource} />

          <hr className="section-divider" />

          {logSource === "eventBus" ? (
            <EventBusFilters
              values={eventBusFilters}
              onChange={setEventBusFilters}
            />
          ) : (
            <div className="coming-soon">
              {SOURCE_LABELS[logSource]} filters coming soon
            </div>
          )}

          <hr className="section-divider" />

          <MessageFilters
            filters={messageFilters}
            onAdd={addFilter}
            onRemove={removeFilter}
            onUpdate={updateFilter}
          />

          <hr className="section-divider" />

          <FieldSelector
            selectedFields={selectedFields}
            onChange={setSelectedFields}
            showBody={logSource === "eventBus"}
          />
        </div>

        <QueryOutput query={query} />
      </div>

      <footer className="app-footer">
        <hr className="footer-divider" />
        <p>Directed by Jesus Plasencia Toledo &middot; 2026</p>
      </footer>
    </div>
  );
}
