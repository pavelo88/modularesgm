import React from 'react';
import { NextPageContext } from 'next';

function Error({ statusCode }: { statusCode?: number }) {
  return (
    <p style={{ textAlign: 'center', padding: '50px', fontFamily: 'sans-serif' }}>
      {statusCode
        ? `Un error ${statusCode} ocurrió en el servidor`
        : 'Un error ocurrió en el cliente'}
    </p>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
