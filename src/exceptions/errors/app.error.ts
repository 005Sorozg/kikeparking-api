// Catálogo de errores: cada error de la API se define una sola vez aquí
export const AppErrors = {
  ROUTE_NOT_FOUND: {
    code: "ROUTE_NOT_FOUND",
    message: "Route not found",
    statusCode: 404,
  },

  INTERNAL_SERVER_ERROR: {
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal server error",
    statusCode: 500,
  },
};