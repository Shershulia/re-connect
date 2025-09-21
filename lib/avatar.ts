export async function getAvatarUrl(nickname: string): Promise<string> {
  // Use unavatar.io for avatar generation
  try {
    const unavatarUrl = `https://unavatar.io/x/${encodeURIComponent(nickname)}`;
    
    // Test if the URL is accessible
    const response = await fetch(unavatarUrl, { method: 'HEAD' });
    if (response.ok) {
      return unavatarUrl;
    }
  } catch (error) {
    console.warn('Unavatar API unavailable, using fallback');
  }

  // Fallback: Generate a simple gradient avatar
  return generateGradientAvatar(nickname);
}

function generateGradientAvatar(nickname: string): string {
  // Generate colors based on nickname hash
  const colors = [
    '#8b5cf6', '#a855f7', '#c084fc', '#d946ef', '#e879f9',
    '#7c3aed', '#9333ea', '#a21caf', '#be185d', '#ec4899'
  ];
  
  const hash = nickname.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const color1 = colors[hash % colors.length];
  const color2 = colors[(hash + 1) % colors.length];
  
  const initial = nickname.charAt(0).toUpperCase();
  
  const svg = `
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="20" fill="url(#grad)"/>
      <text x="50" y="65" font-family="Arial, sans-serif" font-size="40" font-weight="bold" text-anchor="middle" fill="white">${initial}</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}