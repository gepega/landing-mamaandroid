# Landing Tiendas Mamaandroid

Web estática de ejemplo para Tiendas Mamaandroid.

## Publicación recomendada

1. Subir este repositorio a GitHub.
2. En Cloudflare Pages, crear proyecto conectado al repositorio.
3. Configuración:
   - Framework preset: `None`
   - Build command: vacío
   - Build output directory: `/`
4. Conectar el dominio `tiendasmamaandroid.com` desde Cloudflare Pages.
5. Cuando exista el ID de Google Analytics, sustituir en `index.html`:
   `window.MAMAANDROID_GA_ID = "";`
   por el ID real tipo `G-XXXXXXXXXX`.

## Edición

Cambios rápidos:

- Contenido principal: `public/index.html`
- Estilos: `public/styles.css`
- Formulario, scroll y cookies: `public/script.js`
- Imágenes públicas: `public/assets/`

Para revisar localmente, abre:

`public/index.html`
