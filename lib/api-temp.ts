// Temporary API file with hardcoded URL for debugging
const API_URL = 'http://localhost:3002';

export async function fetchConnections() {
  console.log("🔍 fetchConnections using URL:", API_URL);
  const res = await fetch(`${API_URL}/api/connections`);
  if (!res.ok) throw new Error('Error al obtener conexiones');
  return res.json();
}

export async function createConnection(data: any) {
  console.log("🔍 createConnection using URL:", API_URL, "data:", data);
  const res = await fetch(`${API_URL}/api/connections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ createConnection error:", res.status, errorText);
    throw new Error('Error al crear conexión');
  }
  return res.json();
}

export async function importConnection(connectionId: number) {
  console.log("🔍 importConnection using URL:", API_URL, "ID:", connectionId);
  const res = await fetch(`${API_URL}/api/connections/${connectionId}/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ importConnection error:", res.status, errorText);
    throw new Error('Error al importar conexión');
  }
  return res.json();
}

export async function uploadFile(connectionId: number, file: File) {
  console.log("🔍 uploadFile using URL:", API_URL, "ID:", connectionId, "File:", file.name);
  
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await fetch(`${API_URL}/api/connections/${connectionId}/upload`, {
    method: 'POST',
    body: formData,
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ uploadFile error:", res.status, errorText);
    throw new Error('Error al subir archivo');
  }
  return res.json();
}