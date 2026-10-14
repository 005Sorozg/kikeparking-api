// Catálogo de errores: cada error de la API se define una sola vez aquí
export const AppErrors = {
  ROUTE_NOT_FOUND: {
    code: "ROUTE_NOT_FOUND",
    message: "Ruta no encontrada",
    statusCode: 404,
  },

  INTERNAL_SERVER_ERROR: {
    code: "INTERNAL_SERVER_ERROR",
    message: "Error interno del servidor",
    statusCode: 500,
  },

  PARKING_INVALID_SORT: {
    code: "PARKING_INVALID_SORT",
    message: "El valor de sort debe ser 'rating' o 'price'",
    statusCode: 400,
  },

  PARKING_INVALID_ID: {
    code: "PARKING_INVALID_ID",
    message: "El id del parqueadero debe ser un número entero positivo",
    statusCode: 400,
  },

  PARKING_NOT_FOUND: {
    code: "PARKING_NOT_FOUND",
    message: "Parqueadero no encontrado",
    statusCode: 404,
  },

  PARKING_INVALID_DATA: {
    code: "PARKING_INVALID_DATA",
    message: "Los datos del parqueadero no son válidos",
    statusCode: 400,
  },

  USER_EMAIL_IN_USE: {
    code: "USER_EMAIL_IN_USE",
    message: "Ya existe una cuenta con ese correo",
    statusCode: 409,
  },

  USER_INVALID_DATA: {
    code: "USER_INVALID_DATA",
    message: "Los datos del usuario no son válidos",
    statusCode: 400,
  },

  USER_INVALID_CREDENTIALS: {
    code: "USER_INVALID_CREDENTIALS",
    message: "Correo o contraseña incorrectos",
    statusCode: 401,
  }
};