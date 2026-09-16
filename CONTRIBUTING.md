# Contribuir al portfolio

1. Crear una rama desde `main`.
2. Modificar `projects.js`, los recursos o el diseño. Usar HTTPS en enlaces y WebP para capturas.
3. Ejecutar `node scripts/validate.cjs --build` con Node.js 24.
4. Servir `_site` con un servidor estático y comprobar escritorio, móvil, filtros, búsqueda y diálogos.
5. Crear un pull request y esperar a que pase `Validate portfolio`.
6. Integrar con squash. GitHub Pages publica automáticamente solo desde `main`.

No agregar secretos, archivos `.env`, datos personales, material interno ni dependencias externas de ejecución sin una revisión específica. No activar un dominio personalizado sin configurar su DNS y verificarlo previamente.
