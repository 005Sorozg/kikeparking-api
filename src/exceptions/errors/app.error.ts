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

  USER_NOT_FOUND: {
    code: "USER_NOT_FOUND",
    message: "Usuario no encontrado",
    statusCode: 404,
  },

  USER_WRONG_PASSWORD: {
    code: "USER_WRONG_PASSWORD",
    message: "La contraseña actual no es correcta",
    statusCode: 400,
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

  CONVERSATION_INVALID_ID: {
    code: "CONVERSATION_INVALID_ID",
    message: "El id del chat debe ser un número entero positivo",
    statusCode: 400,
  },

  CONVERSATION_NOT_FOUND: {
    code: "CONVERSATION_NOT_FOUND",
    message: "Chat no encontrado",
    statusCode: 404,
  },

  CONVERSATION_OWN_SPOT: {
    code: "CONVERSATION_OWN_SPOT",
    message: "No puedes abrir un chat con tu propio parqueadero",
    statusCode: 400,
  },

  CONVERSATION_INVALID_DATA: {
    code: "CONVERSATION_INVALID_DATA",
    message: "Los datos del chat no son válidos",
    statusCode: 400,
  },

  MESSAGE_INVALID_TEXT: {
    code: "MESSAGE_INVALID_TEXT",
    message: "El mensaje debe tener entre 1 y 1000 caracteres",
    statusCode: 400,
  },

  SUPPORT_REQUEST_INVALID_DATA: {
    code: "SUPPORT_REQUEST_INVALID_DATA",
    message: "Los datos de la solicitud de ayuda no son válidos",
    statusCode: 400,
  },

  REVIEW_INVALID_DATA: {
    code: "REVIEW_INVALID_DATA",
    message: "Los datos de la calificación no son válidos",
    statusCode: 400,
  },

  REVIEW_NOT_COMPLETED: {
    code: "REVIEW_NOT_COMPLETED",
    message: "Solo se pueden calificar reservas completadas",
    statusCode: 409,
  },

  REVIEW_ALREADY_EXISTS: {
    code: "REVIEW_ALREADY_EXISTS",
    message: "Ya calificaste esta reserva",
    statusCode: 409,
  },

  BOOKING_VEHICLE_NOT_ACCEPTED: {
    code: "BOOKING_VEHICLE_NOT_ACCEPTED",
    message: "Este parqueadero no recibe ese tipo de vehículo",
    statusCode: 400,
  },

  BOOKING_ALREADY_PAID: {
    code: "BOOKING_ALREADY_PAID",
    message: "Esta reserva ya está pagada",
    statusCode: 409,
  },

  BOOKING_PAYMENT_EXPIRED: {
    code: "BOOKING_PAYMENT_EXPIRED",
    message: "Se acabó el tiempo para pagar esta reserva. Vuelve a reservar",
    statusCode: 409,
  },

  PAYMENT_INVALID_CARD: {
    code: "PAYMENT_INVALID_CARD",
    message: "Los datos de la tarjeta no son válidos",
    statusCode: 400,
  },

  PAYMENT_DECLINED: {
    code: "PAYMENT_DECLINED",
    message: "El pago fue rechazado",
    statusCode: 402,
  },
};