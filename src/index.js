/**
 * Kedster's Static Cyber Tools - Cloudflare Worker
 * Handles routing and serves the unified directory structure
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;

    // Handle the main directory page
    if (pathname === '/' || pathname === '/index.html') {
      return new Response(await getDirectoryPage(), {
        headers: {
          'Content-Type': 'text/html;charset=UTF-8',
          'Cache-Control': 'public, max-age=300',
        },
      });
    }

    // Handle tool pages - route to the appropriate directory
    if (pathname.startsWith('/tools/') || pathname.startsWith('/dev/') || pathname.startsWith('/Prod/')) {
      // For now, return a placeholder response
      // In a real deployment, this would serve the actual tool files
      return new Response(`Tool page: ${pathname}`, {
        headers: {
          'Content-Type': 'text/html;charset=UTF-8',
        },
      });
    }

    // Handle static assets
    if (pathname.endsWith('.css') || pathname.endsWith('.js') || pathname.endsWith('.png') || pathname.endsWith('.ico')) {
      return new Response('Static asset placeholder', {
        headers: {
          'Content-Type': getContentType(pathname),
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }

    // Default to directory page for any unmatched routes
    return new Response(await getDirectoryPage(), {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
      },
    });
  },
};

/**
 * Get the content type based on file extension
 */
function getContentType(pathname) {
  if (pathname.endsWith('.css')) return 'text/css';
  if (pathname.endsWith('.js')) return 'application/javascript';
  if (pathname.endsWith('.png')) return 'image/png';
  if (pathname.endsWith('.ico')) return 'image/x-icon';
  return 'text/plain';
}

/**
 * Generate the main directory page HTML
 * This would ideally be loaded from the actual index.html file in production
 */
async function getDirectoryPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kedster's Static Cyber Tools - Directory</title>
    <style>
        /* Inline critical CSS for faster loading */
        body { font-family: 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
        .container { max-width: 1400px; margin: 0 auto; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); border-radius: 20px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        .auth-placeholder { position: absolute; top: 20px; right: 20px; background: rgba(52,152,219,0.1); padding: 10px 20px; border-radius: 25px; border: 2px solid #3498db; color: #3498db; font-weight: 600; }
        h1 { font-size: 3.5em; font-weight: 700; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; text-align: center; margin-bottom: 15px; }
        .subtitle { text-align: center; font-size: 1.3em; color: #666; margin-bottom: 30px; }
        .section-header { text-align: center; margin: 50px 0 30px; }
        .section-header h2 { font-size: 2em; color: #333; margin-bottom: 10px; }
        .loading { text-align: center; padding: 40px; color: #667eea; font-size: 1.2em; }
    </style>
</head>
<body>
    <div class="container">
        <div class="auth-placeholder">🔐 Google Authentication Ready</div>
        
        <header>
            <h1>🛡️ Kedster's Static Cyber Tools</h1>
            <p class="subtitle">Comprehensive cybersecurity testing and educational toolkit</p>
        </header>

        <div class="section-header">
            <h2>🚀 Production Tools</h2>
            <p>Fully operational cybersecurity tools ready for professional use</p>
        </div>
        
        <div class="loading">Loading cybersecurity tools directory...</div>
        
        <script>
            // Redirect to the actual directory page
            window.location.href = '/index.html';
        </script>
    </div>
</body>
</html>`;
}