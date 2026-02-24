export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>qBitRemote Tunnel Discovery</h1>
      <p>This service provides tunnel URL discovery for the qBitRemote app.</p>
      <p>
        <code>GET /api/tunnel</code> — returns the current tunnel URL.
      </p>
    </main>
  );
}
