# Fintrack - Gestor de gastos (Scaffold)

Proyecto inicial con React + Vite (JavaScript) y un servidor mock en Node/Express para simular la API.

Requisitos:
- Node.js 18+ instalado

Comandos (Windows PowerShell):
```powershell
# Desde PowerShell en Windows (ajusta la ruta a tu proyecto)
cd D:\Gestor-de-Gastos\fintrack
npm install

# Ejecutar la API mock (server) y Vite simultáneamente:
# "npm run start" usa concurrently para lanzar la API y Vite juntos.
npm run start

# Alternativamente puedes ejecutar solo el frontend o solo el API:
npm run dev    # inicia Vite (frontend) en http://localhost:5173
npm run api    # inicia el API mock en http://localhost:4000
```

Esto iniciará el API mock en el puerto 4000 y Vite en el puerto 5173 (o 5174 para 'preview').

Estructura principal:
- `server.js` - servidor mock Express que sirve `db.json` y rutas de autenticación simples
- `db.json` - datos iniciales (usuarios, movimientos, presupuestos, metas)
- `src/` - código del cliente React

Notas:
- UI basada en paleta pasteles accesible para daltónicos.
- MVP: Login, Dashboard, Presupuestos, Estadísticas y API mock.
