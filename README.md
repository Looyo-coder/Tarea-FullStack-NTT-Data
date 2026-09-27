# PASO: catálogo de productos

Aplicación de catálogo de solo consulta. La interfaz permite buscar por nombre, filtrar por categoría y formato, paginar resultados y consultar la ficha de un producto. No incluye carrito, compras ni administración.

## Inicio rápido

Requisitos: Node.js 18 o posterior y npm.

Desde la raíz del repositorio:

```powershell
cd server
npm ci
npm start
```

Abre <http://localhost:3000>. El servidor sirve la interfaz desde `mockup/` y carga `data/catalog.csv` al iniciar. Si el puerto 3000 está ocupado, define `PORT` antes de `npm start` (por ejemplo, `$env:PORT=3001` en PowerShell).

Para detener el servidor, pulsa `Ctrl+C` en la terminal.

## API

- `GET /api/products?q=<texto>&category=<categoría>&format=<formato>&page=<número>` devuelve una página de productos con `items`, `total`, `page`, `pageSize` y `totalPages`.
- `GET /api/products/filters` devuelve los valores disponibles en `categories` y `formats`.
- `GET /api/meta` conserva compatibilidad y devuelve la misma estructura de filtros.
- `GET /api/products/:id` devuelve el producto solicitado o responde `404` si no existe.

## Criterios y supuestos

- La búsqueda se ejecuta en memoria sobre el catálogo cargado al iniciar; no hay índices de texto. Busca coincidencias parciales, sin distinguir mayúsculas/minúsculas, únicamente en `name`.
- `category` coincide exactamente con el primer nivel de la categoría, antes de ` > `; `format` coincide exactamente con el valor completo del formato.
- `page` es un entero de base 1. Los valores fuera del rango se limitan a una página válida.
- El tamaño de página es fijo en ocho elementos, según el diseño actual de la interfaz.
- Los filtros se calculan desde los valores presentes en el catálogo. La paginación y los filtros se procesan en el backend.

## Pruebas

Desde `server/`, ejecuta:

```powershell
npm test
```

Las pruebas usan el `data/catalog.csv` incluido y Node.js integrado `node:test`; no requieren servicios externos.

## Datos

El servidor necesita `data/catalog.csv`, incluido en este repositorio. La procedencia declarada, los campos y la conversión monetaria se describen en [data/README.md](data/README.md). El CSV original y el script para regenerarlo no están incluidos; por tanto, el catálogo entregado puede ejecutarse y validarse, pero no reconstruirse desde la fuente con este checkout.