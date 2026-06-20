# PerfLog — Cuaderno de rendimiento deportivo

App de entrenamiento con login real, base de datos en la nube (Supabase) e
instalable como app en el móvil (PWA).

Ya está conectada a tu proyecto de Supabase (claves en `src/supabaseClient.js`).
Solo falta ponerla online. Sigue estos pasos en orden — todos se hacen desde tu
navegador, sin terminal.

---

## Paso 1 — Sube el proyecto a GitHub

1. Ve a https://github.com y crea una cuenta gratuita si no tienes.
2. Click en el botón verde **"New"** (o el `+` arriba a la derecha → "New repository").
3. Ponle un nombre, por ejemplo `perflog`. Déjalo en **Public** o **Private**, como prefieras.
   No marques ninguna casilla de "Add README" (ya tenemos uno).
4. Click **"Create repository"**.
5. En la pantalla siguiente, busca la opción **"uploading an existing file"**
   (un enlace de texto, no un botón).
6. Arrastra **todos los archivos y carpetas de este proyecto** ahí
   (incluida la carpeta `src` y `public` completas, `package.json`, `vite.config.js`,
   `index.html`, `.gitignore`). No subas la carpeta `node_modules` si existe
   (no debería estar, pero por si acaso).
7. Abajo, click **"Commit changes"**.

## Paso 2 — Despliega en Vercel (gratis)

1. Ve a https://vercel.com y crea una cuenta gratuita — el botón
   **"Continue with GitHub"** es lo más rápido, así conecta directamente.
2. Una vez dentro, click **"Add New..."** → **"Project"**.
3. Busca tu repositorio `perflog` en la lista y dale a **"Import"**.
4. Vercel detecta automáticamente que es un proyecto Vite — no toques nada
   de la configuración.
5. Click **"Deploy"** y espera 1-2 minutos.
6. Al terminar, te da una URL pública del tipo `https://perflog-tuusuario.vercel.app`
   — esa es tu app, ya en internet, accesible desde cualquier dispositivo.

## Paso 3 — Instálala en tu móvil como app

**iPhone (Safari):**
1. Abre la URL de Vercel en Safari (tiene que ser Safari, no Chrome, para que
   funcione la instalación en iOS).
2. Toca el icono de compartir (cuadrado con flecha hacia arriba).
3. Desplázate y toca **"Añadir a pantalla de inicio"**.
4. Confirma. Te aparecerá el icono de PerfLog en tu pantalla, como cualquier app.

**Android (Chrome):**
1. Abre la URL de Vercel en Chrome.
2. Te debería aparecer un aviso abajo tipo "Instalar app" — acéptalo.
   Si no aparece solo: toca el menú (⋮) → **"Instalar app"** o
   **"Añadir a pantalla de inicio"**.
3. Confirma. Icono instalado.

A partir de aquí se abre a pantalla completa, sin barra de navegador, como
una app nativa. Funciona también sin conexión para ver datos ya cargados
(gracias al service worker de la PWA), aunque para guardar/sincronizar
necesitas conexión a internet.

## Paso 4 — Regístrate dentro de la app

1. Abre la app instalada.
2. Pulsa "¿No tienes cuenta? Regístrate".
3. Pon tu email y una contraseña (mínimo 6 caracteres).
4. Revisa tu correo y pulsa el enlace de confirmación que te envía Supabase.
5. Vuelve a la app e inicia sesión.

Cada persona que quiera usar la app repite este registro con su propio email
— cada una verá solo sus propios entrenos, nunca los de otra persona.

---

## Actualizar la app en el futuro

Si en otra conversación me pides cambios (nuevos campos, nuevo deporte,
ajustes de diseño...), te daré el archivo `App.jsx` actualizado. Para
publicarlo:

1. En GitHub, entra en tu repositorio → carpeta `src` → archivo `App.jsx`.
2. Click en el icono de lápiz (editar).
3. Borra todo el contenido y pega el nuevo.
4. Click **"Commit changes"**.
5. Vercel detecta el cambio automáticamente y vuelve a desplegar solo
   (1-2 minutos). No hay que hacer nada más en Vercel.

## Estructura del proyecto

```
perflog-pwa/
├── index.html              punto de entrada HTML
├── package.json             dependencias
├── vite.config.js           configuración de build + PWA
├── supabase-schema.sql      esquema de base de datos (ya ejecutado)
├── public/
│   ├── icon-192.png         icono de la app
│   └── icon-512.png         icono de la app (alta resolución)
└── src/
    ├── main.jsx              arranque de React
    ├── App.jsx                la aplicación completa (calendario, formularios, gráficas)
    ├── Auth.jsx                pantalla de login/registro
    └── supabaseClient.js      conexión a tu base de datos
```
