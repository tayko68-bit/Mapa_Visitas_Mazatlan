// api/negocios.js
export default async function handler(req, res) {
  try {
    const { giro, lat1, lon1, lat2, lon2, page = 1, limit = 2000 } = req.query;

    if (!giro) {
      return res.status(400).json({ error: "Falta parámetro ?giro=" });
    }

    // Token en variable de entorno (NO lo pongas hardcodeado en el archivo)
    const token = process.env.DENUE_API_KEY;
    if (!token) {
      return res.status(500).json({ error: "No hay DENUE_API_KEY configurada en env" });
    }

    // Validar bbox si vienen los 4 parámetros, si no, hacer una búsqueda sin bbox
    let denueUrl;
    if (lat1 && lon1 && lat2 && lon2) {
      // Formato: lat1,lon1,lat2,lon2
      denueUrl = `https://www.inegi.org.mx/app/api/denue/v1/consulta/buscar/${encodeURIComponent(giro)}/${lat1},${lon1},${lat2},${lon2}/${page}/${limit}?token=${token}`;
    } else {
      // Si no hay bbox, hacer búsqueda por texto (puede devolver mucha info)
      denueUrl = `https://www.inegi.org.mx/app/api/denue/v1/consulta/buscar/${encodeURIComponent(giro)}/${page}/${limit}?token=${token}`;
    }

    const resp = await fetch(denueUrl);
    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      return res.status(resp.status).json({ error: "DENUE error", statusText: resp.statusText, body: text });
    }
    const data = await resp.json();

    // Cabeceras CORS para que el frontend (GitHub Pages) pueda consumirlo
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    return res.status(200).json(data);
  } catch (err) {
    console.error("error proxy denue:", err);
    return res.status(500).json({ error: err.message });
  }
}
