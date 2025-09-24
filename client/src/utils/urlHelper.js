
export const buildFileUrl = (path) => {
  if (!path) return null;

  // Si ya es absoluta (http o https), devuélvela igual
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Si es relativa, antepón la URL base del backend
  const apiUrl = process.env.NODE_ENV === 'production'
    ? 'https://iest-inventarios.onrender.com'
    : 'http://localhost:3001';

  return `${apiUrl}/${path}`;
};
