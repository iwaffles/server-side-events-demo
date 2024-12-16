const http = require('http');

// Create a server
const server = http.createServer((req, res) => {
  if (req.url === '/events') {
    // Set headers for SSE
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    // Send initial message
    res.write('data: Welcome to Server-Sent Events!\n\n');

    // Send periodic messages
    let counter = 0;
    const interval = setInterval(() => {
      counter++;
      res.write(`data: Message #${counter} from the server\n\n`);
    }, 2000);

    // Clean up when the client disconnects
    req.on('close', () => {
      clearInterval(interval);
      console.log('Client disconnected');
    });
  } else {
    // Serve the HTML file
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Server-Sent Events Demo</title>
            </head>
            <body>
                <h1>Server-Sent Events</h1>
                <div id="messages"></div>
                <script>
                    const eventSource = new EventSource('/events');
                    const messagesDiv = document.getElementById('messages');
                    
                    eventSource.onmessage = (event) => {
                        const message = document.createElement('div');
                        message.textContent = event.data;
                        messagesDiv.appendChild(message);
                    };

                    eventSource.onerror = () => {
                        console.error('SSE connection error');
                        eventSource.close();
                    };
                </script>
            </body>
            </html>
        `);
  }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

