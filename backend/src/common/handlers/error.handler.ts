export function errorHandler(error: any) {
  if (error.extensions.originalError) {
    return { message: error.extensions.originalError.message };
  } else if (error.extensions.i18nError) {
    return { message: error.extensions.i18nError.errors };
  }
  return { message: error.message };
}
