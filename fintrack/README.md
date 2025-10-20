# Fintrack - Gestor de gastos (Scaffold)
```markdown
# Fintrack - Gestor de gastos (Scaffold)

Proyecto con React + Vite (JavaScript) y un servidor mock en Node/Express para desarrollo local.

Requisitos
- Node.js 18+ (o LTS compatible)

Instrucciones (PowerShell — Windows)
```powershell
# 1) Abrir PowerShell y posicionarse en la carpeta del proyecto
cd D:\Gestor-de-Gastos\fintrack

# 2) Instalar dependencias (solo la primera vez o tras cambios en package.json)
npm install

# 3) Ejecutar frontend y API juntos (usa concurrently)
npm run start

# Alternativas para desarrollo
npm run dev    # Inicia solo Vite (frontend) en http://localhost:5173
npm run api    # Inicia solo el API mock en http://localhost:4000
```

Notas importantes
- No resetees `db.json` si tienes datos de prueba que quieras conservar. Este README **no** ejecuta ningún script que borre la base.
- Si ves datos 'demo' en la UI, limpia la caché/localStorage del navegador (ver cómo abajo) en lugar de modificar `db.json`.

Limpiar localStorage (sin tocar `db.json`)
1) Abre el navegador en http://localhost:5173
2) Abre las DevTools (F12) → Application → Local Storage → selecciona la entrada `http://localhost:5173`
3) Borra la clave `user` o ejecuta en la consola: `localStorage.removeItem('user')`

Workflow recomendado
- Levanta primero la API (npm run api) y luego Vite (npm run dev) si quieres ver logs separados.
- Usa el flujo: Registrar → Onboarding → Dashboard. El onboarding escribe presupuestos/objetivos y balances en `db.json` con `ownerId`.

Estructura del proyecto
- `server.js` - servidor mock Express que gestiona auth y recursos (lee/escribe `db.json`)
- `db.json` - almacenamiento local (JSON). No lo resetees si quieres conservar pruebas.
- `src/` - cliente React

Soporte y pruebas
- Encontrarás scripts de prueba en `scripts/` para pruebas rápidas de API (por ejemplo `quickRegister.js`). Úsalos solo para reproducir flujos; no resetean DB.

Si quieres, puedo:
- Mejorar aún más la interfaz visual (fuentes, iconos SVG, micro-interacciones). 
- Añadir un comando opcional `npm run reset-db` (lo haré solo si confirmas explícitamente que quieres poder resetear la DB).

```
