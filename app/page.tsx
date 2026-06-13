"use client";

import { useState, useMemo, useCallback } from "react";
import type {
  MessageFilter,
  EventBusFilterValues,
  SelectedFields,
  BodyFormat,
} from "@/types";
import { MAX_BODY_FILTERS } from "@/types";
import { buildQuery } from "@/lib/queryBuilder";
import EventBusFilters from "@/components/EventBusFilters";
import MessageFilters from "@/components/MessageFilters";
import FieldSelector from "@/components/FieldSelector";
import QueryOutput from "@/components/QueryOutput";

export default function Home() {
  const [eventBusFilters, setEventBusFilters] = useState<EventBusFilterValues>({
    source: "",
    detailType: "",
  });
  const [messageFilters, setMessageFilters] = useState<MessageFilter[]>([]);
  const [bodyFormat, setBodyFormat] = useState<BodyFormat>("json");
  const [selectedFields, setSelectedFields] = useState<SelectedFields>({
    timestamp: true,
    logStream: true,
    message: true,
    detail: false,
  });

  const query = useMemo(
    () => buildQuery({ eventBusFilters, messageFilters, selectedFields, bodyFormat }),
    [eventBusFilters, messageFilters, selectedFields, bodyFormat]
  );

  const addFilter = useCallback(() => {
    setMessageFilters((prev) =>
      prev.length >= MAX_BODY_FILTERS
        ? prev
        : [
            ...prev,
            { id: crypto.randomUUID(), key: "", value: "", dataType: "string" },
          ]
    );
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
          <EventBusFilters
            values={eventBusFilters}
            onChange={setEventBusFilters}
          />

          <hr className="section-divider" />

          <MessageFilters
            filters={messageFilters}
            bodyFormat={bodyFormat}
            onBodyFormatChange={setBodyFormat}
            onAdd={addFilter}
            onRemove={removeFilter}
            onUpdate={updateFilter}
          />

          <hr className="section-divider" />

          <FieldSelector
            selectedFields={selectedFields}
            onChange={setSelectedFields}
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
