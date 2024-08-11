import React from 'react';
import GroupDisplay from './GroupDisplay';

const AeropuertoGroup = ({ data }) => {
  return (
    <div className="aeropuerto-group">
      {Object.keys(data).map((key) => (
        <GroupDisplay key={key} title={key}>
          {typeof data[key] === 'object' ? (
            <AeropuertoGroup data={data[key]} />
          ) : (
            <div>{data[key]}</div>
          )}
        </GroupDisplay>
      ))}
    </div>
  );
};

export default AeropuertoGroup;
