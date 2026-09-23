# Portfolio de Ideamos

[![Publicación](https://github.com/estudioideamos/ideamos-portfolio/actions/workflows/pages.yml/badge.svg)](https://github.com/estudioideamos/ideamos-portfolio/actions/workflows/pages.yml)

**[Ver portfolio](https://estudioideamos.github.io/ideamos-portfolio/)** · [Reportar un problema](https://github.com/estudioideamos/ideamos-portfolio/issues/new/choose) · [Seguridad](SECURITY.md)

Galería de trabajos de Ideamos para compartir con clientes: tiendas online, sitios corporativos y aplicaciones. Incluye filtros, búsqueda, vistas ampliadas y enlaces a publicaciones disponibles. Diseño adaptable, navegación por teclado y soporte de movimiento reducido.

## Estructura

| Archivo | Uso |
| --- | --- |
| `index.html`, `styles.css`, `app.js` | Página, estilos e interacciones |
| `projects.js` | Catálogo de proyectos |
| `assets/` | Marca, tipografía, capturas originales y copias WebP |
| `scripts/validate.cjs` | Validación y preparación de los archivos públicos |
| `.github/workflows/pages.yml` | Controles y publicación en GitHub Pages |
| `.github/dependabot.yml` | Revisión semanal de versiones de Actions |

## Actualizar un trabajo

Editar `projects.js`: `id` único, `name`, `category` (`tiendas`, `corporativos` o `apps`), `sector`, `description`, `image` y `url`. Usar una captura WebP en `assets/` y un enlace HTTPS verificado. Si no hay publicación disponible, dejar `url` vacío; la galería muestra el diseño sin enlazar a un sitio no disponible.

## Validar y publicar

Requiere Node.js 24 para las comprobaciones. La web no tiene dependencias de ejecución ni necesita instalar paquetes.

```sh
node scripts/validate.cjs --build
```

Servir `_site/` con un servidor estático para revisar el resultado. No abrir el HTML directamente con `file://`, porque la política de seguridad está pensada para HTTP/HTTPS.

Los pull requests ejecutan `Validate portfolio`. Al integrar cambios en `main`, se valida nuevamente y se publica únicamente `_site/`. El constructor usa una lista explícita de archivos: herramientas, documentación, configuración y capturas originales no referenciadas no se despliegan. El despliegue utiliza las credenciales temporales de GitHub, sin claves personales almacenadas.

La rama principal requiere pull request y comprobaciones correctas. No se exige una segunda persona para aprobar: el propietario puede mantener el proyecto por su cuenta. Los cambios se integran con squash y se eliminan las ramas integradas.

## Calidad y límites

Las comprobaciones validan sintaxis, categorías, identificadores únicos, rutas locales, imágenes existentes, enlaces HTTPS, metadatos y presupuesto de peso (2 MB por archivo, 16 MB en total). No prueban la disponibilidad de las webs externas en cada ejecución: requieren revisión periódica. Revisar también filtros, búsqueda, diálogos y escritorio/celular antes de integrar cambios visuales.

`robots.txt` se incluye como referencia de publicación; en un sitio de proyecto GitHub Pages los rastreadores consultan el archivo de la raíz del dominio, fuera de este repositorio. El sitemap sí está disponible en la ruta del portfolio.

## Marca y contenido

El logo, Gilroy y las vistas de Trébol Café, ONER VFX, Raisa Joya y Mirtatulaj provienen de ideamos.com.ar. Las demás capturas corresponden a los proyectos de Ideamos. Las extensiones se presentan con composiciones tipográficas y no incluyen su código privado. La disponibilidad pública de este repositorio no modifica los derechos sobre marcas, tipografías o material de terceros.

Ver [cómo contribuir](CONTRIBUTING.md) y la [política de seguridad](SECURITY.md).

## Portadas y fichas de proyecto

El catálogo reúne proyectos de las cuentas `estudioideamos` e `ideamosestudio`. Cada ficha puede incluir `features` y `technologies` (listas de textos), `cover` (captura de escritorio), `mobile` (captura móvil), `theme` (slate, sand, olive, lilac, coral, ice, charcoal u orange) e `isNew` (destacado visual).

`image` conserva la vista ampliada. Las portadas se componen con CSS y capturas reales, sin simular interfaces que el proyecto no tiene. Si no hay captura móvil, se muestra solamente escritorio. Las tecnologías se verifican con los archivos y dependencias del repositorio; en los trabajos históricos sin código disponible, la ficha muestra la descripción y el alcance visual sin atribuirles tecnologías no confirmadas.

## Rendimiento de las imágenes

La galería usa WebP responsivo (`thumb`, `thumbLarge`, `phoneThumb`, `phoneThumbLarge`) con sus anchos reales, `srcset`, carga diferida y dimensiones reservadas. La ficha reutiliza el mockup de escritorio y celular de la galería; no solicita capturas largas. Las capturas de mayor resolución (`cover` y `mobile`) se cargan únicamente al abrir el detalle. Las capturas largas (`image`) se conservan como fuentes y no se publican. Gravedad utiliza una vista estática del encabezado y hero originales del tema. Las extensiones WooCommerce usan interfaces ilustrativas identificadas como tales.

El validador exige variantes responsivas y limita el peso de las miniaturas a 2 MB para todo el catálogo y el sitio completo a 16 MB, incluyendo detalles bajo demanda.
## Verificación de rendimiento

Prueba local en Edge, pantalla de 1440 px y móvil de 390 px, ambos con densidad 2x: 12 y 8 recursos iniciales respectivamente, aproximadamente 609 KB y 289 KB (sin incluir el HTML). Ninguna imagen de detalle se solicita al entrar. La descarga de miniaturas comienza a 300 px del área visible. Se verificaron las 37 portadas, los 37 mockups móviles, búsqueda, filtros, apertura/cierre de ficha, enlaces, ausencia de imágenes rotas y ausencia de desbordes. Estas mediciones locales no equivalen a una puntuación Lighthouse ni a datos de usuarios reales.

La ficha presenta un mockup grande de escritorio y celular, sin repetir la tarjeta de la galería, con la información al costado en escritorio y debajo en móvil. Incluye navegación anterior/siguiente dentro del filtro y búsqueda activos, también con las teclas izquierda/derecha. Mantiene descripción, características, tecnologías disponibles y enlace Visitar sitio. Las flechas circulares giran 45 grados con hover/foco y respetan movimiento reducido.
