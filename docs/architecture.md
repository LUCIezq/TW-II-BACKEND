# Arquitectura del Proyecto

## Visión General

El proyecto sigue una arquitectura por capas orientada a separar responsabilidades y facilitar la mantenibilidad, escalabilidad y testeo de la aplicación.

La aplicación está compuesta por:

* Frontend: Angular
* Backend: Node.js + Express
* ORM: Prisma
* Base de datos: MySQL
* Contenedorización: Docker

---

# Estructura General

```text
src/
│
├── modules/
│   ├── products/
│   ├── categories/
│   ├── orders/
│   └── users/
│
├── shared/
│
├── infrastructure/
│
├── config/
│
└── server.ts
```

Cada módulo encapsula su propia lógica de negocio, evitando dependencias innecesarias entre dominios.

---

# Principios de Diseño

## 1. Separación de Responsabilidades

Cada capa tiene una única responsabilidad.

### Controller

Responsable de:

* Recibir requests HTTP.
* Validar datos básicos.
* Invocar casos de uso.
* Retornar respuestas HTTP.

No contiene lógica de negocio.

Ejemplo:

```text
POST /api/products
```

El controller recibe la solicitud y delega la creación del producto al servicio correspondiente.

---

### Service

Contiene las reglas de negocio de la aplicación.

Ejemplos:

* Validar stock.
* Calcular descuentos.
* Verificar permisos.
* Procesar pedidos.

Los servicios no conocen detalles de Express.

---

### Repository

Encapsula el acceso a datos.

Responsabilidades:

* Consultar la base de datos.
* Crear registros.
* Actualizar registros.
* Eliminar registros.

Los servicios interactúan con repositorios y no directamente con Prisma.

---

### Prisma

Prisma actúa como capa de persistencia.

Su responsabilidad es traducir operaciones del dominio a consultas SQL.

---

# Flujo de una Solicitud

```text
Cliente
    │
    ▼
Controller
    │
    ▼
Service
    │
    ▼
Repository
    │
    ▼
Prisma
    │
    ▼
MySQL
```

Ejemplo:

```text
POST /api/orders
```

1. El Controller recibe el pedido.
2. El Service valida stock y precios.
3. El Repository persiste el pedido.
4. Prisma genera el SQL.
5. MySQL almacena los datos.

---

# Modelado del Dominio

Las entidades representan conceptos reales del negocio.

## Usuario

Representa un cliente del sistema.

Responsable de:

* Autenticación.
* Información personal.
* Historial de compras.

---

## Categoria

Se modela como entidad propia.

Motivos:

* Permite filtrar productos.
* Permite mantener catálogos consistentes.
* Evita depender de strings.

Relación:

```text
Categoria 1 ---- N Producto
```

---

## Producto

Representa un artículo disponible para la venta.

Información persistida:

* Nombre.
* Descripción.
* Precio.
* Stock.
* Categoría.

No almacena información calculable.

Ejemplo:

No se persiste:

```text
Disponible
Últimas unidades
Sin stock
```

Estas etiquetas se calculan a partir del stock.

---

## Oferta

Representa descuentos temporales.

Se almacena:

* Precio promocional.
* Fecha de inicio.
* Fecha de finalización.

No se almacena:

```text
Porcentaje de descuento
```

porque puede calcularse:

```text
descuento = precioOriginal - precioOferta
```

---

## Pedido

Representa una compra confirmada.

Contiene:

* Usuario.
* Fecha.
* Total.
* Items.

---

## ItemPedido

Representa una línea dentro de un pedido.

Ejemplo:

```text
Pedido #15

- Mouse x2
- Teclado x1
- Monitor x1
```

Cada línea es un ItemPedido.

---

# Datos Persistidos vs Datos Calculados

Una regla fundamental del proyecto es:

> Persistir hechos y calcular interpretaciones.

Persistimos:

```text
precio
stock
cantidad
fecha
```

Calculamos:

```text
descuento
estado de stock
total visual
```

Esto evita inconsistencias y duplicación de información.

---

# Historial de Compras

Los precios de los productos pueden cambiar.

Por ese motivo ItemPedido almacena:

```text
precioUnitario
```

Este valor representa el precio real pagado durante el checkout.

Esto garantiza la integridad histórica de los pedidos.

---

# Estrategia del Carrito

El carrito no forma parte del modelo persistente.

Se considera un estado temporal.

La aplicación utiliza:

```text
localStorage
```

para almacenar:

```text
ItemCarrito
```

Al realizar el checkout:

```text
ItemCarrito
```

se transforma en:

```text
Pedido
ItemPedido
```

que sí se persisten en la base de datos.

---

# Migraciones

La estructura de la base de datos es gestionada mediante Prisma Migrations.

## Crear una migración

Cuando se modifica `schema.prisma`:

```bash
npx prisma migrate dev --name descripcion-cambio
```

Ejemplo:

```bash
npx prisma migrate dev --name agregar-stock
```

---

## Aplicar migraciones existentes

Cuando un integrante descarga cambios del repositorio:

```bash
git pull
npx prisma migrate deploy
```

Esto ejecuta todas las migraciones pendientes.

---

# Convenciones del Proyecto

## Servicios

Todos los servicios deben contener únicamente lógica de negocio.

No deben acceder directamente a Express.

---

## Repositorios

Toda consulta a la base de datos debe realizarse mediante repositorios.

No se realizan consultas Prisma desde controllers.

---

## Controllers

Los controllers deben mantenerse delgados.

Su única responsabilidad es coordinar la interacción HTTP.

---

# Objetivos de la Arquitectura

* Mantener el código desacoplado.
* Facilitar testing.
* Facilitar mantenimiento.
* Evitar duplicación de lógica.
* Permitir crecimiento del sistema sin generar dependencias difíciles de mantener.
