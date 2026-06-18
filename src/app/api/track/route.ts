import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { sessionId, path } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // 1. Log page view in database
    await prisma.pageView.create({
      data: {
        sessionId,
        path: path || '/',
      },
    });

    // 2. Upsert active session status
    await prisma.activeSession.upsert({
      where: { id: sessionId },
      update: { lastSeen: new Date() },
      create: { id: sessionId, lastSeen: new Date() },
    });

    // 3. Clean up expired active sessions (older than 10 minutes)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    await prisma.activeSession.deleteMany({
      where: {
        lastSeen: {
          lt: tenMinutesAgo,
        },
      },
    }).catch((err) => console.error('Error cleaning up active sessions:', err));

    // 4. Calculate stats from actual DB entries
    const now = new Date();
    // Start of today in local date (server environment timezone)
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);

    // Count page view entries in DB
    const [todayCount, yesterdayCount, totalCount, onlineCount] = await Promise.all([
      prisma.pageView.count({
        where: {
          timestamp: {
            gte: startOfToday,
          },
        },
      }),
      prisma.pageView.count({
        where: {
          timestamp: {
            gte: startOfYesterday,
            lt: startOfToday,
          },
        },
      }),
      prisma.pageView.count(),
      prisma.activeSession.count({
        where: {
          lastSeen: {
            gte: new Date(Date.now() - 5 * 60 * 1000), // Active in the last 5 minutes
          },
        },
      }),
    ]);

    return NextResponse.json({
      today: todayCount,
      yesterday: yesterdayCount,
      total: totalCount,
      online: Math.max(1, onlineCount), // Always display at least 1 (the current user)
    });
  } catch (error) {
    console.error('Tracking API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
