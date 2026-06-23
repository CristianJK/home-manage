export function handleServerError(err, setServerError) {
  if (err.response?.status === 422) {
    const fields = err.response.data?.errors;
    setServerError(
      fields
        ? Object.values(fields).flat().join("\n")
        : "Error de validación. Revisa los campos."
    );
  } else {
    setServerError("Error al guardar. Intenta de nuevo.");
  }
}
