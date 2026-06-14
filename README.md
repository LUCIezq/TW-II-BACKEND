# TW-II Backend

## Requisitos previos

Antes de comenzar, asegurarse de tener instalado:

* Node.js (versión 20 o superior)
* npm
* Docker Desktop
* Git

---

## 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd TW-II-Backend
```

---

## 2. Instalar dependencias

Instalar todas las dependencias del proyecto:

```bash
npm install
```

---

## 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
DATABASE_URL="mysql://root:root@localhost:3306/ecommerce"

MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=ecommerce
MYSQL_USER=user
MYSQL_PASSWORD=pass
```

---

## 4. Levantar la base de datos

Iniciar el contenedor de MySQL:

```bash
docker compose up -d
```

Verificar que el contenedor esté ejecutándose:

```bash
docker ps
```

Debería aparecer un contenedor llamado:

```text
mysql-db
```

---

## 5. Ejecutar migraciones

Crear la estructura de la base de datos:

```bash
npx prisma migrate deploy
```

Si es la primera vez que se trabaja sobre el proyecto y no existen migraciones o queremos crear una migracion:

```bash
npx prisma migrate dev --name <nombre_migracion>
```

---

## 6. Generar Prisma Client

```bash
npx prisma generate
```

---

## 7. Ejecutar el proyecto

Modo desarrollo:

```bash
npm run dev
```

o

```bash
npx tsx watch src/server.ts
```

(según la configuración actual del proyecto)

---

## Comandos útiles

### Ver estado de migraciones

```bash
npx prisma migrate status
```

### Abrir Prisma Studio

```bash
npx prisma studio
```

### Ver contenedores activos

```bash
docker ps
```

### Detener la base de datos

```bash
docker compose down
```

### Eliminar base de datos y volumen

⚠️ Esto elimina todos los datos almacenados.

```bash
docker compose down -v
```

---

## Flujo recomendado para nuevos integrantes

1. Clonar repositorio.
2. Ejecutar `npm install`.
3. Crear archivo `.env`.
4. Ejecutar `docker compose up -d`.
5. Ejecutar `npx prisma migrate deploy`.
6. Ejecutar `npx prisma generate`.
7. Ejecutar `npm run dev`.

Si todos los pasos fueron correctos, el proyecto debería iniciar sin configuración adicional.
# TW-II-BACKEND
