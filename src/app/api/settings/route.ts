import { NextResponse } from 'next/server';
import { getSiteSettingsData } from '@/lib/content';

export async function GET() {
  try {
    const settings = await getSiteSettingsData();
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({
      settings: {
        resumeVisible: false,
        resumeUrl: null,
        adminEmail: 'sarthak_tallamraju@mymail.sutd.edu.sg',
      },
    });
  }
}
