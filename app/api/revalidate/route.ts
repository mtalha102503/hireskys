import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const path = searchParams.get('path');

    // 1. Security Check: Koi hacker isko hit na kar sake
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    // 2. Path Check aur Revalidation
    if (path) {
      revalidatePath(path);
      
      // Smart Logic: Agar nayi job aayi hai, toh automatically homepage bhi update kar do
      if (path.startsWith('/jobs') || path === '/') {
        revalidatePath('/');
      }

      return NextResponse.json({ revalidated: true, path, now: Date.now() });
    }

    return NextResponse.json({ message: 'Path is missing in URL' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating', error: String(err) }, { status: 500 });
  }
}