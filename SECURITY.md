# Seguridad

La versión mantenida es la publicada desde `main`.

Para reportar una vulnerabilidad, usá [Report a vulnerability](https://github.com/estudioideamos/ideamos-portfolio/security/advisories/new). Como alternativa, escribí a hola@ideamos.com.ar. No compartas credenciales, datos de clientes o pruebas sensibles en issues públicos.

El sitio es estático, no tiene servidor de aplicaciones, cuentas de usuario ni base de datos. El botón de contacto abre WhatsApp. Los proyectos enlazados son sitios independientes y tienen sus propias políticas.

## Controles

- HTTPS obligatorio en GitHub Pages.
- Detección de secretos y protección de pushes en GitHub.
- Actions con permisos mínimos, acciones oficiales fijadas por commit y actualizaciones mediante Dependabot.
- Validación de catálogo, rutas, recursos y presupuesto de peso antes de publicar.
- Publicación desde una lista explícita de archivos; documentación, herramientas y originales no usados quedan fuera.
- Política CSP en el documento y referrer limitado. GitHub Pages no ofrece configuración de cabeceras HTTP arbitrarias: esta CSP no sustituye controles de servidor como `frame-ancestors`.

Estas medidas reducen riesgos; no constituyen una garantía de ausencia de vulnerabilidades.
