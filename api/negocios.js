// api/negocios.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const { giro, lat1, lon1, lat2, lon2 } = req.query;

    if (!giro || !lat1 || !lat2 || !lon1 || !lon2) {
      return res.status(400).json({ error: "Faltan parámetros" });
    }

    const token = process.env.DENUE_API_KEY;
    if (!token) {
      return res.status(500).json({ error: "No se encontró la variable DENUE_API_KEY" });
    }

    // Construye la URL para el DENUE
    const url = `https://www.inegi.org.mx/app/api/denue/v1/consulta/buscar/${encodeURIComponent(
      giro
    )}?type=json&token=${token}&lat1=${lat1}&lat2=${lat2}&lon1=${lon1}&lon2=${lon2}`;

    // Llamada a la API
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: `DENUE responded with status ${response.status}` });
    }

    const data = await response.json();

    // Retorna los datos tal cual
    res.status(200).json(data);
  } catch (error) {
    console.error("Error proxy DENUE:", error);
    res.status(500).json({ error: "fetch failed", details: error.message });
  }
}
