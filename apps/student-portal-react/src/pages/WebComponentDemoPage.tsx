import React, { useEffect, useState, useRef } from 'react';
import { Card, Alert } from '@dormflow/ui-react';
import '@dormflow/web-components';

export const WebComponentDemoPage: React.FC = () => {
  const [eventLogs, setEventLogs] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpenIssue = (e: any) => {
      const detail = e.detail;
      const log = `[${new Date().toLocaleTimeString()}] Custom Event 'dormflow-open-issue' caught in React: Issue ${detail.issueId} (${detail.title || ''})`;
      setEventLogs(prev => [log, ...prev]);
    };

    const node = containerRef.current;
    if (node) {
      node.addEventListener('dormflow-open-issue', handleOpenIssue);
    }
    return () => {
      if (node) {
        node.removeEventListener('dormflow-open-issue', handleOpenIssue);
      }
    };
  }, []);

  return (
    <div className="container" ref={containerRef}>
      <h1 style={{ color: '#005691', marginBottom: '8px' }}>
        Web Component in React Demonstration
      </h1>
      <p style={{ color: '#64748b', marginBottom: '24px' }}>
        This page demonstrates embedding the framework-neutral <code>&lt;dormflow-issue-status&gt;</code> custom element directly into a React view, handling its attributes and catching browser DOM events across the Shadow DOM boundary.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <div>
          <h3>Issue #101: Heating Failure</h3>
          {/* @ts-ignore - custom element */}
          <dormflow-issue-status
            issue-id="iss-101"
            api-base-url="http://localhost:4000"
          />
        </div>

        <div>
          <h3>Issue #102: Laundry Drain Error</h3>
          {/* @ts-ignore - custom element */}
          <dormflow-issue-status
            issue-id="iss-102"
            api-base-url="http://localhost:4000"
          />
        </div>
      </div>

      <Card>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: '#0f172a' }}>
          React Event Listener Logs
        </h3>
        {eventLogs.length === 0 ? (
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
            Click "View Full Details →" on either widget above to see custom event propagation.
          </p>
        ) : (
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.875rem', fontFamily: 'monospace' }}>
            {eventLogs.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '6px', color: '#005691' }}>{item}</li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};
