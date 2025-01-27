import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      describe:"Esta es una api que cre para facilitarme el facilitar mis finazas personales me permite registrar transacion de forma facil y crear uana lista de presupuesto",
      version: '1.0.0',
    },
  },
  apis: [path.join(__dirname, '../routes/*.ts')], // Asegúrate de que esta ruta esté bien configurada
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export { swaggerSpec, swaggerUi };
