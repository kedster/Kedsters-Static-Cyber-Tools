/**
 * CyberTools - Cloudflare Worker
 * Handles routing and serves the unified directory structure
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;

    // Add Cloudflare Worker identification headers to all responses
    const baseHeaders = {
      'X-Powered-By': 'Cloudflare Workers',
      'CF-Worker': 'kedsters-static-cyber-tools',
      'X-Worker-Version': '1.0.0',
      'Server': 'Cloudflare'
    };

    // Handle the main directory page
    if (pathname === '/' || pathname === '/index.html') {
      return new Response(await getDirectoryPage(), {
        headers: {
          ...baseHeaders,
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
          ...baseHeaders,
          'Content-Type': 'text/html;charset=UTF-8',
        },
      });
    }

    // Handle API endpoints for verification
    if (pathname.startsWith('/api/')) {
      return handleAPIRequest(pathname, request, env, baseHeaders);
    }

    // Handle static assets
    if (pathname.endsWith('.css') || pathname.endsWith('.js') || pathname.endsWith('.png') || pathname.endsWith('.ico')) {
      return new Response('Static asset placeholder', {
        headers: {
          ...baseHeaders,
          'Content-Type': getContentType(pathname),
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }

    // Default to directory page for any unmatched routes
    return new Response(await getDirectoryPage(), {
      headers: {
        ...baseHeaders,
        'Content-Type': 'text/html;charset=UTF-8',
      },
    });
  },
};

/**
 * Handle API requests for verification and testing
 */
function handleAPIRequest(pathname, request, env, baseHeaders) {
  const url = new URL(request.url);
  
  // Health check endpoint
  if (pathname === '/api/health') {
    return new Response(JSON.stringify({
      status: 'healthy',
      service: 'kedsters-static-cyber-tools',
      timestamp: new Date().toISOString(),
      worker: true,
      environment: env.ENVIRONMENT || 'unknown',
      version: '1.0.0'
    }), {
      headers: {
        ...baseHeaders,
        'Content-Type': 'application/json',
      },
    });
  }

  // Worker information endpoint
  if (pathname === '/api/worker-info') {
    return new Response(JSON.stringify({
      name: 'kedsters-static-cyber-tools',
      version: '1.0.0',
      routes: [
        '/',
        '/index.html',
        '/tools/*',
        '/dev/*',
        '/Prod/*',
        '/api/*'
      ],
      features: [
        'Directory serving',
        'Tool routing',
        'Static asset handling',
        'API endpoints'
      ],
      cloudflare: true,
      timestamp: new Date().toISOString()
    }), {
      headers: {
        ...baseHeaders,
        'Content-Type': 'application/json',
      },
    });
  }

  // Default API response
  return new Response(JSON.stringify({
    error: 'API endpoint not found',
    available: ['/api/health', '/api/worker-info']
  }), {
    status: 404,
    headers: {
      ...baseHeaders,
      'Content-Type': 'application/json',
    },
  });
}

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
    <title>CyberTools - Professional Security Toolkit</title>
    <style>
        /* Inline critical CSS for faster loading */
        body { font-family: 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
        .container { max-width: 1400px; margin: 0 auto; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); border-radius: 20px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        .auth-placeholder { position: absolute; top: 20px; right: 20px; background: rgba(52,152,219,0.1); padding: 10px 20px; border-radius: 25px; border: 2px solid #3498db; color: #3498db; font-weight: 600; }
        h1 { font-size: 3.5em; font-weight: 700; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; text-align: center; margin-bottom: 15px; }
        .subtitle { text-align: center; font-size: 1.3em; color: #666; margin-bottom: 30px; }
        .section-header { text-align: center; margin: 50px 0 30px; }
        .section-header h2 { font-size: 2em; color: #333; margin-bottom: 10px; }
        .tools-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin: 30px 0; }
        .tool-card { background: rgba(255,255,255,0.8); border-radius: 15px; padding: 20px; box-shadow: 0 8px 16px rgba(0,0,0,0.1); transition: transform 0.3s; }
        .tool-card:hover { transform: translateY(-5px); }
        .tool-card h3 { color: #333; margin-bottom: 10px; }
        .tool-card p { color: #666; font-size: 0.9em; line-height: 1.4; }
        .status-indicator { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 0.8em; font-weight: 600; }
        .status-prod { background: #27ae60; color: white; }
        .status-dev { background: #3498db; color: white; }
        .verification-panel { background: rgba(52,152,219,0.1); border-radius: 15px; padding: 20px; margin: 30px 0; border: 2px solid #3498db; }
        .verification-panel h3 { color: #2c3e50; margin-top: 0; }
        .verification-commands { background: rgba(0,0,0,0.05); border-radius: 8px; padding: 15px; font-family: 'Courier New', monospace; font-size: 0.9em; }
        .command { display: block; margin: 5px 0; color: #2c3e50; }
    </style>
</head>
<body>
    <div class="container">
        <div class="auth-placeholder">🔐 Google Authentication Ready</div>
        
        <header>
            <h1>🛡️ CyberTools</h1>
            <p class="subtitle">Comprehensive cybersecurity testing and educational toolkit</p>
        </header>

        <div class="verification-panel">
            <h3>🔍 Cloudflare Verification Tools</h3>
            <p>Use these commands to verify your Cloudflare configuration:</p>
            <div class="verification-commands">
                <code class="command">npm run verify              # Full verification</code>
                <code class="command">npm run verify:dns          # DNS configuration</code>
                <code class="command">npm run verify:worker       # Worker deployment</code>
                <code class="command">npm run verify:homepage     # Homepage availability</code>
                <code class="command">npm run troubleshoot        # Troubleshooting guide</code>
            </div>
        </div>

        <div class="section-header">
            <h2>🚀 Production Tools</h2>
            <p>Fully operational cybersecurity tools ready for professional use</p>
        </div>
        
        <div class="tools-grid">
            <div class="tool-card">
                <h3>WHOIS Lookup Tool <span class="status-indicator status-prod">PROD</span></h3>
                <p>Comprehensive domain information lookup with RDAP support and detailed analysis.</p>
            </div>
            <div class="tool-card">
                <h3>DNS Poisoning Checker <span class="status-indicator status-prod">PROD</span></h3>
                <p>Advanced DNS analysis tool for detecting poisoning attacks and inconsistencies.</p>
            </div>
        </div>

        <div class="section-header">
            <h2>🧪 Featured Development Tools</h2>
            <p>Advanced tools with comprehensive functionality</p>
        </div>
        
        <div class="tools-grid">
            <div class="tool-card">
                <h3>2FA Code Brute-Force Demo <span class="status-indicator status-dev">DEV</span></h3>
                <p>Educational TOTP brute force simulator with real-time code generation.</p>
            </div>
            <div class="tool-card">
                <h3>API Security Tester <span class="status-indicator status-dev">DEV</span></h3>
                <p>Comprehensive REST API security testing suite with vulnerability detection.</p>
            </div>
            <div class="tool-card">
                <h3>Access Control Matrix Tester <span class="status-indicator status-dev">DEV</span></h3>
                <p>Role-based access control testing environment with client-side role mocking.</p>
            </div>
        </div>

        <div class="section-header">
            <h2>📊 Statistics</h2>
            <div class="tools-grid">
                <div class="tool-card">
                    <h3>📈 Total Tools: 345+</h3>
                    <p>Production Ready: 2 • Featured Development: 5 • In Development: 338+</p>
                </div>
                <div class="tool-card">
                    <h3>🔧 Worker Status</h3>
                    <p>✅ Cloudflare Workers Active<br>✅ API Endpoints Available<br>✅ Verification Tools Ready</p>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        // Add worker identification to console
        console.log('%c🛡️ CyberTools', 'font-size: 20px; color: #667eea; font-weight: bold;');
        console.log('%cPowered by Cloudflare Workers', 'color: #3498db;');
        console.log('Worker: kedsters-static-cyber-tools v1.0.0');
        
        // Add simple tool navigation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tool-card')) {
                console.log('Tool clicked:', e.target.querySelector('h3').textContent);
            }
        });
    </script>
</body>
</html>`;
}