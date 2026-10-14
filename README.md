# MediCita — Corte 2

API de práctica académica con Node.js, Express y MySQL. **No utiliza interfaz web**: Swagger UI sirve para documentar y ejecutar solicitudes.

## Inicio rápido

1. Importar `database/medicita.sql` en MySQL Workbench (sobre una base nueva).
2. Ejecutar `npm install` (o `npm.cmd install` en PowerShell si hay bloqueo de scripts).
3. Copiar `.env.example` a `.env` y escribir la contraseña local de MySQL.
4. Ejecutar `npm start` o `node src/server.js`.
5. Abrir **http://localhost:5000/api-docs**.

El script SQL crea las tablas y algunas especialidades. Para probar la API, seguir el orden de solicitudes de la colección `postman/MediCita.postman_collection.json`.

## Funciones implementadas

- CRUD básico para `patients`, `doctors`, `specialties` y `doctor_schedules`.
- Alta de usuarios y validación de credenciales en `POST /api/auth/login`.
- Registro de citas con verificación de conflictos de horario, estado de cita y conservación del precio pactado.
- Reseñas con comentario y espera opcionales, solo en citas atendidas.
- Resultados médicos numéricos, cualitativos y de imagenología con tabla común y detalle especializado.
- Swagger UI en `/api-docs`, organizado por **Pacientes, Usuarios, Médicos, Especialidades, Horarios, Etiquetas, Citas, Reseñas y Resultados médicos**. Contrato OpenAPI en `docs/openapi.yaml`.

## Observaciones y límites del corte

**La consigna exige contraseñas en texto plano para este corte.** Por ese motivo el ejercicio académico cumple la instrucción, pero esto es **inseguro** para un sistema real. No usar datos reales ni publicar el sistema; para el corte 3 deben incorporarse hashing Argon2id, autenticación real por sesiones o tokens, permisos de acceso, protección de resultados médicos y carga protegida de imágenes. El login actual verifica credenciales, pero no emite sesión ni restringe otros endpoints.

El campo `image_path` referencia un archivo de imagen que se almacenaría en un servicio privado más adelante; este corte no implementa subida de archivos. `review_tags` y `review_tag_assignments` permiten crear etiquetas y asociarlas a reseñas mediante los endpoints de la API.

No se generan ingresos cobrados: se registra el precio de cada cita para reportes posteriores.

## Estructura

`src/routes` define los endpoints; `src/controllers` traduce HTTP; `src/services` aplica reglas de negocio; `src/repositories` y `src/config` acceden a MySQL. `src/middleware` estandariza errores. No incluir `.env` ni `node_modules` en GitHub.

## Evidencias

`postman/MediCita.postman_collection.json` contiene solicitudes de éxito y error de los grupos principales. Se deben ejecutar y guardar respuestas reales, no simular evidencias. El video del curso debe mostrar operaciones en vivo y durar menos de 5 minutos.

## Navegación sencilla por Swagger

1. Abrir `http://localhost:5000/api-docs`.
2. Abrir **Pacientes → POST /patients — Agregar paciente** y ejecutar.
3. Abrir **Usuarios → POST /users — Agregar usuario**, indicando el `patient_id` que se creó.
4. Abrir **Inicio de sesión → POST /auth/login — Iniciar sesión**.
5. Abrir **Médicos** para agregar o ver médicos, y **Citas** para agendar.

Las etiquetas visibles de Swagger están en español; los nombres de endpoints y campos JSON siguen en inglés conforme a buenas prácticas. Reinicia el servidor después de reemplazar el proyecto.

## Publicación en GitHub

Subir **el contenido de esta carpeta a la raíz del repositorio público**, sin una carpeta `MediCita_GitHub` adicional. No publicar `.env` ni `node_modules`. La variable `DB_PASSWORD` se configura únicamente en el `.env` local; `.env.example` no contiene contraseñas reales.

El enlace `http://localhost:5000/api-docs` es de uso local; para compartir documentación con terceros se requiere un despliegue público independiente.
