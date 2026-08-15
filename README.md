# Ruleta de Premios — Frontend

Esta es la parte visual de la ruleta (lo que ve el operador y el
participante en la tablet). Ya está conectada al backend real en Railway —
solo le falta su propia dirección pública para poder abrirse desde
cualquier navegador (incluida la tablet) sin las restricciones de la vista
previa del chat.

## Correr en local (opcional, solo para probar)

```bash
npm install
npm run dev
```

## Desplegar en Vercel

1. Subí esta carpeta a un repositorio de GitHub (mismo procedimiento que
   con el backend: `git init`, `git add .`, `git commit`, crear el repo
   vacío en GitHub, `git remote add origin ...`, `git push`).
2. Entrá a [vercel.com](https://vercel.com) e iniciá sesión con tu cuenta
   de GitHub.
3. Apretá **"Add New..." → "Project"**, elegí el repositorio que acabás
   de subir.
4. Vercel detecta solo que es un proyecto Vite — no hay que tocar
   ninguna configuración. Apretá **"Deploy"**.
5. En un minuto te da una URL propia (algo como
   `ruleta-frontend.vercel.app`). Esa es la que abrís en la tablet.
