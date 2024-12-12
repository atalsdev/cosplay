export function handleTransition(request: Request) {
  const headers = new Headers();
  
  // Add transition headers
  headers.set('Vary', 'Accept');
  headers.set('Cache-Control', 'no-store');
  
  if (request.headers.get('Accept')?.includes('text/html')) {
    headers.set('Content-Type', 'text/html');
  }
  
  return headers;
}
