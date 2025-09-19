export default async function handler(req, res) {
  try {
    // Obtenemos el parámetro de búsqueda desde la URL
    // Ejemplo: /api/negocios?query=ferreteria
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Falta parámetro ?query=" });
    }

    // Llamamos al API de DENUE (INEGI)
    // Documentación: https://www.inegi.org.mx/app/api/denue/
    const apiKey = process.env.DENUE_API_KEY; // Guarda tu API key en variables de entorno en Vercel
    const url = `https://www.inegi.org.mx/app/api/denue/v1/consulta/Buscar/${encodeURIComponent(query)}/-99.1332,19.4326,1000/${apiKey}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }

    const data = await response.json();

    // Retornamos el resultado directamente
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
