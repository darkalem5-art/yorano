export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();

  // Sadece ana sayfa
  if (url.pathname !== '/' && url.pathname !== '/index.html') {
    return context.next();
  }

  // Googlebot kontrolü (SEO için)
  const isGooglebot = /googlebot|mediapartners-google|adsbot-google|google-inspectiontool/i.test(userAgent);
  if (isGooglebot) {
    console.log('Googlebot detected – serving index.html');
    return context.next();
  }

  // Ülke bilgisi (Cloudflare)
  const country = request.cf?.country;

  // Türkiye'den gelenler
  if (country === 'TR') {
    console.log('Turkey visitor – redirecting to tr.html');
    return Response.redirect(`${url.origin}/tr2.html`, 302);
  }

  // Diğer ülkeler → index.html
  return context.next();
}
