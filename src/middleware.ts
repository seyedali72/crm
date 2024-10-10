import { NextRequest, NextResponse } from 'next/server';

export function redirect_to(role: number) {
	return role === 0
		? '/pishkhan'
		: role === 1
			? '/account/dashboard'
			: role === 2
				? '/crm/dashboard'
				: role === 3
					? '/hrm/dashboard'
					: role === 4
						? '/expert/dashboard'
						: role === 5
							? '/expert/dashboard'
							: role === 0
								? '/auth/signin'
								: '/account';
}

export function sendTo(request: any, role: number) {
	const url = request.nextUrl.clone();
	url.pathname = redirect_to(role);
	return NextResponse.redirect(url);
}

export function middleware(request: NextRequest) {
	let cookie = request.cookies.get('user');
	let obj = cookie && JSON.parse(cookie?.value);
	let role = obj?.role;

	if (!role) {
		const a = request.nextUrl.pathname
		if (a.startsWith("/auth/")) {
			return NextResponse.next();
		}
		return sendTo(request, 0);
	} else if (request.nextUrl.pathname.includes('crm/')) {
		if (role === 2) return NextResponse.next();
		return sendTo(request, role);
	} else if (request.nextUrl.pathname.includes('expert/')) {
		if (role === 4) return NextResponse.next();
		return sendTo(request, role);
	} else if (request.nextUrl.pathname.includes('expert/')) {
		if (role === 5) return NextResponse.next();
		return sendTo(request, role);
	} else if (request.nextUrl.pathname.includes('hrm/')) {
		if (role === 3) return NextResponse.next();
		return sendTo(request, role);
	} else if (request.nextUrl.pathname.includes('account/')) {
		if (role === 1) return NextResponse.next();
		return sendTo(request, role);
	} else {
		// stop loggedin user from going to signup/signin page
		const ban = ['/auth/signin', '/auth/signup'];
		if (ban.includes(request.nextUrl.pathname)) {
			return sendTo(request, role);
		}
		return NextResponse.next();
	}
}

export const config = {
	matcher: [
		/* all paths except those starting with: api | _next/static | ... */
		'/((?!api|uploads|_next/static|_next/image|icons|favicon.ico|manifest.json|sw.js).*)(.+)',
	]
};
