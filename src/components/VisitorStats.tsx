'use client';

import React, { useState, useEffect } from 'react';

export default function VisitorStats() {
  const [stats, setStats] = useState({
    today: 0,
    yesterday: 0,
    total: 0,
    online: 1,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Generate or get a persistent unique session ID for the user
    let sessionId = localStorage.getItem('dlh_session_id');
    if (!sessionId) {
      sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      localStorage.setItem('dlh_session_id', sessionId);
    }

    const trackVisit = async () => {
      try {
        const res = await fetch('/api/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            path: window.location.pathname,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setStats({
            today: data.today || 0,
            yesterday: data.yesterday || 0,
            total: data.total || 0,
            online: data.online || 1,
          });
        }
      } catch (err) {
        console.error('Failed to track visit:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // Track on initial mount
    trackVisit();

    // Poll every 30 seconds to keep the session alive and get updated stats
    const interval = setInterval(trackVisit, 30000);

    return () => clearInterval(interval);
  }, []);

  const statsItems = [
    {
      label: 'Hari Ini',
      value: isLoading ? '...' : stats.today.toLocaleString('id-ID'),
      icon: 'today',
      color: 'text-primary bg-primary/5',
    },
    {
      label: 'Kemarin',
      value: isLoading ? '...' : stats.yesterday.toLocaleString('id-ID'),
      icon: 'history',
      color: 'text-secondary bg-secondary/5',
    },
    {
      label: 'Total Kunjungan',
      value: isLoading ? '...' : stats.total.toLocaleString('id-ID'),
      icon: 'analytics',
      color: 'text-info bg-primary/5',
    },
    {
      label: 'Online',
      value: isLoading ? '...' : stats.online.toString(),
      icon: 'sensors',
      color: 'text-green-600 bg-green-50',
      isOnline: true,
    },
  ];

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Statistik Pengunjung</h4>
      <div className="grid grid-cols-2 gap-3">
        {statsItems.map((stat, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-surface-container rounded-2xl border border-outline-variant hover:shadow-sm transition-all duration-300"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${stat.color} relative`}>
              <span className="material-symbols-outlined text-lg">{stat.icon}</span>
              {stat.isOnline && !isLoading && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white animate-ping"></span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider leading-none mb-1 truncate">
                {stat.label}
              </p>
              <p className="text-sm font-extrabold text-on-surface leading-none">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
