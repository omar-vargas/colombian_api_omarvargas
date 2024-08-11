import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GroupDisplay from './GroupDisplay';

const AtraccionesTab = () => {
  const [atracciones, setAtracciones] = useState([]);
  const [departamentos, setDepartamentos] = useState({});
  const [tiempoRespuesta, setTiempoRespuesta] = useState(null);

  useEffect(() => {
    const fetchAtracciones = async () => {
      const start = Date.now();
      try {
        const response = await axios.get('https://api-colombia.com/api/v1/TouristicAttraction');
        setAtracciones(response.data);

        // Extraer los IDs de los departamentos únicos
        const departmentIds = [...new Set(response.data.map(atraccion => atraccion.city?.departmentId))];

        // Hacer solicitudes para obtener los nombres de los departamentos
        const departmentRequests = departmentIds.map(id => 
          axios.get(`https://api-colombia.com/api/v1/Department/${id}`)
        );
        const departmentResponses = await Promise.all(departmentRequests);

        // Crear un mapa de ID a nombre del departamento
        const departmentMap = departmentResponses.reduce((acc, response) => {
          const { id, name } = response.data;
          acc[id] = name;
          return acc;
        }, {});
        
        setDepartamentos(departmentMap);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
      const end = Date.now();
      setTiempoRespuesta(end - start);
    };

    fetchAtracciones();
  }, []);

  // Agrupar atracciones por departamento y ciudad
  const atraccionesAgrupadas = agruparAtraccionesPorDepartamentoYCiudad(atracciones, departamentos);

  return (
    <div className="atracciones-tab">
      <h3>Agrupamiento por Departamento y Ciudad</h3>
      <GroupDisplay title="Atracciones">
        {Object.keys(atraccionesAgrupadas).map(departamento => (
          <GroupDisplay key={departamento} title={departamento}>
            {Object.keys(atraccionesAgrupadas[departamento]).map(ciudad => (
              <div key={ciudad}>
                {ciudad}: {atraccionesAgrupadas[departamento][ciudad]}
              </div>
            ))}
          </GroupDisplay>
        ))}
      </GroupDisplay>

      {tiempoRespuesta && (
        <p className="response-time">Tiempo de respuesta: {tiempoRespuesta} ms</p>
      )}
    </div>
  );
};

// Función de agrupamiento
const agruparAtraccionesPorDepartamentoYCiudad = (atracciones, departamentos) => {
  return atracciones.reduce((acc, atraccion) => {
    const departamentoId = atraccion.city?.departmentId;
    const departamento = departamentos[departamentoId] || 'Departamento desconocido';
    const ciudad = atraccion.city?.name || 'Ciudad desconocida';

    if (!acc[departamento]) {
      acc[departamento] = {};
    }

    if (!acc[departamento][ciudad]) {
      acc[departamento][ciudad] = 0;
    }

    acc[departamento][ciudad]++;
    return acc;
  }, {});
};

export default AtraccionesTab;
