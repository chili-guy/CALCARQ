export function createPageUrl(page: string): string {
  const pageMap: Record<string, string> = {
    Calculator: '/calculator',
    Home: '/',
  }
  
  return pageMap[page] || `/${page.toLowerCase()}`
}
