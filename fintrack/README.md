# Fintrack - Gestor de gastos (Scaffold)

Proyecto inicial con React + Vite (JavaScript) y un servidor mock en Node/Express para simular la API.

Requisitos:
- Node.js 18+ instalado

Comandos (Windows PowerShell):
```powershell
cd C:\Users\marqu\OneDrive\Documentos\INTERFACES\fintrack
npm install
npm run start
```

Esto iniciará el API mock en el puerto 4000 y Vite en el puerto 5173.

Estructura principal:
- `server.js` - servidor mock Express que sirve `db.json` y rutas de autenticación simples
- `db.json` - datos iniciales (usuarios, movimientos, presupuestos, metas)
- `src/` - código del cliente React

Notas:
- UI basada en paleta pasteles accesible para daltónicos.
- MVP: Login, Dashboard, Presupuestos, Estadísticas y API mock.
