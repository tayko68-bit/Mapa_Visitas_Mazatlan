// api/negocios.js
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

export default async function handler(req, res) {
  try {
    const { giro, lat1, lat2, lon1, lon2 } = req.query;

    if (!giro || !lat1 || !lat2 || !lon1 || !lon2) {
      return res.status(400).json({ error: "Faltan parámetros: giro, lat1, lat2, lon1, lon2" });
    }

    const token = "9a61f789-3f11-4b4f-8aab-83d770c471f9";

    const url = `https://www.inegi.org.mx/app/api/denue/v1/consulta/buscar/${encodeURIComponent(giro)}?type=json&token=${token}&lat1=${lat1}&lat2=${lat2}&lon1=${lon1}&lon2=${lon2}`;

    const response = await fetch(url);

    // Verificar si DENUE respondió correctamente
    const text = await response.text();
    if (!text.startsWith("[")) { // no es JSON
      return res.status(500).json({ error: "DENUE no devolvió JSON", details: text.substring(0, 300) });
    }

    const data = JSON.parse(text);
    res.status(200).json(data);

  } catch (error) {
    console.error("Error DENUE:", error);
    res.status(500).json({ error: "fetch failed", details: error.message });
  }
}
