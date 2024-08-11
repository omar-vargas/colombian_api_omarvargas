import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PresidentesTab = () => {
  const [presidentes, setPresidentes] = useState([]);
  const [tiempoRespuesta, setTiempoRespuesta] = useState(null);

  useEffect(() => {
    const fetchPresidentes = async () => {
      const start = Date.now();
      try {
        const response = await axios.get('https://api-colombia.com/api/v1/President');
        setPresidentes(response.data);
      } catch (error) {
        console.error('Error fetching presidentes:', error);
      }
      const end = Date.now();
      setTiempoRespuesta(end - start);
    };

    fetchPresidentes();
  }, []);

  const agruparPresidentesPorPartido = (presidentes) => {
    return presidentes.reduce((acc, presidente) => {
      const partido = presidente.politicalParty || 'Independiente';

      if (!acc[partido]) {
        acc[partido] = [];
      }

      acc[partido].push(presidente);
      return acc;
    }, {});
  };

  const presidentesAgrupados = agruparPresidentesPorPartido(presidentes);

  return (
    <div>
      <h2>Presidentes</h2>
      <div className="grouped-data">
        {Object.keys(presidentesAgrupados).map(partido => (
          <div key={partido}>
            <h3>{partido}</h3>
            <ul>
              {presidentesAgrupados[partido].map(presidente => (
                <li key={presidente.id}>
                  {presidente.name} {presidente.lastName} ({presidente.startPeriodDate} - {presidente.endPeriodDate})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {tiempoRespuesta && (
        <p className="response-time">Tiempo de respuesta: {tiempoRespuesta} ms</p>
      )}
    </div>
  );
};

export default PresidentesTab;
