import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AeropuertoGroup from './AeropuertoGroup';
import GroupDisplay from './GroupDisplay';

const AeropuertosTab = () => {
  const [aeropuertos, setAeropuertos] = useState([]);
  const [regiones, setRegiones] = useState({});
  const [tiempoRespuesta, setTiempoRespuesta] = useState(null);
  const [orden, setOrden] = useState({ criterio: 'nombre', direccion: 'ascendente' });

  useEffect(() => {
    const fetchAeropuertos = async () => {
      const start = Date.now();
      try {
        const response = await axios.get('https://api-colombia.com/api/v1/Airport');
        setAeropuertos(response.data);

        const regionIds = [...new Set(response.data.map(aeropuerto => aeropuerto.department?.regionId))];
        const regionRequests = regionIds.map(id => axios.get(`https://api-colombia.com/api/v1/Region/${id}`));
        const regionResponses = await Promise.all(regionRequests);

        const regionMap = regionResponses.reduce((acc, response) => {
          const { id, name } = response.data;
          acc[id] = name;
          return acc;
        }, {});

        setRegiones(regionMap);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
      const end = Date.now();
      setTiempoRespuesta(end - start);
    };

    fetchAeropuertos();
  }, []);

  // Agrupamientos
  const aeropuertosPorDepartamentoYCiudad = agruparAeropuertosPorDepartamentoYCiudad(aeropuertos);
  const aeropuertosPorRegionDepartamentoCiudadTipo = agruparAeropuertosPorRegionDepartamentoCiudadTipo(aeropuertos, regiones);

  // Ordenar los datos
  const aeropuertosOrdenadosDeptoCiudad = ordenarDatos(aeropuertosPorDepartamentoYCiudad, orden);
  const aeropuertosOrdenadosRegionDeptoCiudadTipo = ordenarDatos(aeropuertosPorRegionDepartamentoCiudadTipo, orden);

  return (
    <div className="aeropuertos-tab">
      <h3>Agrupamiento por Departamento y Ciudad</h3>
      <div className="orden-controls">
        <label>Ordenar por:</label>
        <select onChange={(e) => setOrden({ ...orden, criterio: e.target.value })} value={orden.criterio}>
          <option value="nombre">Nombre</option>
          <option value="conteo">Conteo</option>
        </select>
        <button onClick={() => setOrden({ ...orden, direccion: 'ascendente' })}>
          Ascendente
        </button>
        <button onClick={() => setOrden({ ...orden, direccion: 'descendente' })}>
          Descendente
        </button>
      </div>
      <GroupDisplay title="Aeropuertos por Departamento y Ciudad">
        {Object.keys(aeropuertosOrdenadosDeptoCiudad).map(departamento => (
          <GroupDisplay key={departamento} title={departamento}>
            {Object.keys(aeropuertosOrdenadosDeptoCiudad[departamento]).map(ciudad => (
              <div key={ciudad}>
                {ciudad}: {aeropuertosOrdenadosDeptoCiudad[departamento][ciudad]}
              </div>
            ))}
          </GroupDisplay>
        ))}
      </GroupDisplay>

      <h3>Agrupamiento por Región, Departamento, Ciudad y Tipo</h3>
      <AeropuertoGroup data={aeropuertosOrdenadosRegionDeptoCiudadTipo} />

      {tiempoRespuesta && (
        <p className="response-time">Tiempo de respuesta: {tiempoRespuesta} ms</p>
      )}
    </div>
  );
};

// Funciones de agrupamiento
const agruparAeropuertosPorDepartamentoYCiudad = (aeropuertos) => {
  return aeropuertos.reduce((acc, aeropuerto) => {
    const departamento = aeropuerto.department?.name || 'Departamento desconocido';
    const ciudad = aeropuerto.city?.name || 'Ciudad desconocida';

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

const agruparAeropuertosPorRegionDepartamentoCiudadTipo = (aeropuertos, regiones) => {
  return aeropuertos.reduce((acc, aeropuerto) => {
    const regionId = aeropuerto.department?.regionId;
    const region = regiones[regionId] || 'Región desconocida';
    const departamento = aeropuerto.department?.name || 'Departamento desconocido';
    const ciudad = aeropuerto.city?.name || 'Ciudad desconocida';
    const tipo = aeropuerto.type || 'Tipo desconocido';

    if (!acc[region]) {
      acc[region] = {};
    }

    if (!acc[region][departamento]) {
      acc[region][departamento] = {};
    }

    if (!acc[region][departamento][ciudad]) {
      acc[region][departamento][ciudad] = {};
    }

    if (!acc[region][departamento][ciudad][tipo]) {
      acc[region][departamento][ciudad][tipo] = 0;
    }

    acc[region][departamento][ciudad][tipo]++;
    return acc;
  }, {});
};

// Función para ordenar los datos
const ordenarDatos = (datos, orden) => {
  const { criterio, direccion } = orden;

  const sortFunction = (a, b) => {
    if (criterio === 'nombre') {
      return direccion === 'ascendente' ? a[0].localeCompare(b[0]) : b[0].localeCompare(a[0]);
    } else {
      return direccion === 'ascendente' ? a[1] - b[1] : b[1] - a[1];
    }
  };

  const sortedData = {};
  Object.keys(datos).sort((a, b) => sortFunction([a], [b])).forEach(key => {
    sortedData[key] = datos[key];
  });

  return sortedData;
};

export default AeropuertosTab;
