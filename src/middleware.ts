import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicPath = path === '/login' || path === '/signup';
  const token = req.cookies.get('token')?.value || '';

  const res = NextResponse.next();
  res.headers.set('Access-Control-Allow-Credentials', 'true');
  res.headers.set('Access-Control-Allow-Origin', `${process.env.VERCEL_ENV}`);
  res.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS'); 
  res.headers.set(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') { 
    return res;
  }
  
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  return res; 
}

export const config = {
  matcher: [
    '/login',
    '/signup',
    '/changePassword',
    '/api/:path*',
  ],
};