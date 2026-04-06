import { useMemo } from 'react';
import { AUDIT_EVENTS } from '../../utils/constants';

/**
 * ActivityLog - A component to display audit logs.
 * @param {Array} events - The events to display
 */
export default function ActivityLog({ events }) {
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => b.timestamp - a.timestamp).slice(0, 50);
  }, [events]);

  if (sortedEvents.length === 0) {
    return <div className="text-gray-500 text-center p-8">No activity recorded yet.</div>;
  }

  return (
    <div className="space-y-3">
      {sortedEvents.map((ev, i) => {
        const type = AUDIT_EVENTS[ev.type] || { label: 'Event', color: '#666', icon: '📝' };
        return (
          <div key={i} className="flex items-center gap-4 p-4 bg-gray-900/40 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ backgroundColor: `${type.color}22`, color: type.color }}>
              {type.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-200 truncate">{type.label}</h4>
                <span className="text-xs text-gray-500">
                  {new Date(ev.timestamp * 1000).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-500 truncate">{ev.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
