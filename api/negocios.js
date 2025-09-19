// File: api/negocios.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const { giro, lat1, lat2, lon1, lon2 } = req.query;
    const token = "9a61f789-3f11-4b4f-8aab-83d770c471f9"; // tu token DENUE

    if (!giro || !lat1 || !lat2 || !lon1 || !lon2) {
      return res.status(400).json({ error: "Parámetros incompletos" });
    }

    // Normalizar el giro para la URL
    const giroEncoded = encodeURIComponent(giro.toUpperCase().trim());

    const url = `https://www.inegi.org.mx/app/api/denue/v1/consulta/buscar/${giroEncoded}?type=json&token=${token}&lat1=${lat1}&lat2=${lat2}&lon1=${lon1}&lon2=${lon2}`;

    const response = await fetch(url);

    // Validar que la respuesta sea JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      return res.status(500).json({
        error: "DENUE no devolvió JSON",
        details: text.slice(0, 300) // mostrar solo los primeros 300 caracteres
      });
    }

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Error en la API DENUE",
        status: response.status,
        statusText: response.statusText
      });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Error DENUE:", err);
    res.status(500).json({ error: "Error al consultar DENUE", details: err.message });
  }
}
