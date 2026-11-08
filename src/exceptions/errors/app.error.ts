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

  PARKING_NOT_OWNED: {
    code: "PARKING_NOT_OWNED",
    message: "Este parqueadero no es tuyo",
    statusCode: 403,
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
  },

  AUTH_TOKEN_MISSING: {
    code: "AUTH_TOKEN_MISSING",
    message: "Debes iniciar sesión para realizar esta acción",
    statusCode: 401,
  },

  AUTH_TOKEN_INVALID: {
    code: "AUTH_TOKEN_INVALID",
    message: "La sesión no es válida o expiró",
    statusCode: 401,
  },

  AUTH_FORBIDDEN_ROLE: {
    code: "AUTH_FORBIDDEN_ROLE",
    message: "Tu tipo de cuenta no tiene permiso para realizar esta acción",
    statusCode: 403,
  },

    UPLOAD_NO_FILE: {
    code: "UPLOAD_NO_FILE",
    message: "Debes adjuntar una imagen",
    statusCode: 400,
  },

  UPLOAD_INVALID_FILE: {
    code: "UPLOAD_INVALID_FILE",
    message: "El archivo debe ser una imagen JPG, PNG o WebP",
    statusCode: 400,
  },

  UPLOAD_FILE_TOO_LARGE: {
    code: "UPLOAD_FILE_TOO_LARGE",
    message: "La imagen no puede pesar más de 5 MB",
    statusCode: 413,
  },

    PARKING_PHOTO_LIMIT: {
    code: "PARKING_PHOTO_LIMIT",
    message: "Un parqueadero puede tener máximo 5 fotos",
    statusCode: 409,
  },

  PARKING_PHOTO_INVALID_ID: {
    code: "PARKING_PHOTO_INVALID_ID",
    message: "El id de la foto debe ser un número entero positivo",
    statusCode: 400,
  },

  PARKING_PHOTO_NOT_FOUND: {
    code: "PARKING_PHOTO_NOT_FOUND",
    message: "Foto no encontrada en este parqueadero",
    statusCode: 404,
  },

  BOOKING_INVALID_DATA: {
    code: "BOOKING_INVALID_DATA",
    message: "Los datos de la reserva no son válidos",
    statusCode: 400,
  },

  BOOKING_INVALID_ID: {
    code: "BOOKING_INVALID_ID",
    message: "El id de la reserva debe ser un número entero positivo",
    statusCode: 400,
  },

  BOOKING_NOT_FOUND: {
    code: "BOOKING_NOT_FOUND",
    message: "Reserva no encontrada",
    statusCode: 404,
  },

  BOOKING_SPOT_UNAVAILABLE: {
    code: "BOOKING_SPOT_UNAVAILABLE",
    message: "Este parqueadero no está recibiendo reservas en este momento",
    statusCode: 409,
  },

  BOOKING_OWN_SPOT: {
    code: "BOOKING_OWN_SPOT",
    message: "No puedes reservar tu propio parqueadero",
    statusCode: 403,
  },

  BOOKING_TIME_TAKEN: {
    code: "BOOKING_TIME_TAKEN",
    message: "El parqueadero ya está reservado en ese horario. Prueba con otra fecha u hora",
    statusCode: 409,
  },

  BOOKING_FORBIDDEN: {
    code: "BOOKING_FORBIDDEN",
    message: "No tienes permiso sobre esta reserva",
    statusCode: 403,
  },

  BOOKING_ALREADY_CANCELLED: {
    code: "BOOKING_ALREADY_CANCELLED",
    message: "Esta reserva ya estaba cancelada",
    statusCode: 409,
  },

  BOOKING_ALREADY_FINISHED: {
    code: "BOOKING_ALREADY_FINISHED",
    message: "No se puede cancelar una reserva que ya terminó",
    statusCode: 409,
  },
};