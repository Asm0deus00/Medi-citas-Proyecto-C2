# MediCita — Corte 2

API de práctica académica con Node.js, Express y MySQL. **No utiliza interfaz web**: Swagger UI sirve para documentar y ejecutar solicitudes.

## Inicio rápido

1. Importar `database/medicita.sql` en MySQL Workbench (sobre una base nueva).
2. Ejecutar `npm install` (o `npm.cmd install` en PowerShell si hay bloqueo de scripts).
3. Copiar `.env.example` a `.env`, escribir la contraseña local de MySQL y establecer un SESSION_SECRET aleatorio de al menos 32 caracteres.
4. Ejecutar `npm start` o `node src/server.js`.
5. Abrir **http://localhost:5000/api-docs**. Ejecutar **POST /auth/login**, copiar `token`, pulsar **Authorize** y pegar el token (sin prefijo Bearer).

El script SQL crea las tablas y algunas especialidades. Para probar la API, seguir el orden de solicitudes de la colección `postman/MediCita.postman_collection.json`.

## Funciones implementadas

- CRUD básico para `patients`, `doctors`, `specialties` y `doctor_schedules`.
- Alta de usuarios y validación de credenciales en `POST /api/auth/login`.
- Registro de citas con verificación de conflictos de horario, estado de cita y conservación del precio pactado.
- Reseñas con comentario y espera opcionales, solo en citas atendidas.
- Resultados médicos numéricos, cualitativos y de imagenología con tabla común y detalle especializado.
- Swagger UI en `/api-docs`, organizado por **Pacientes, Usuarios, Médicos, Especialidades, Horarios, Etiquetas, Citas, Reseñas y Resultados médicos**. Contrato OpenAPI en `docs/openapi.yaml`.

## Observaciones y límites del corte

**La consigna exige contraseñas en texto plano para este corte.** Por ese motivo el ejercicio académico cumple la instrucción, pero esto es **inseguro** para un sistema real. No usar datos reales ni publicar el sistema; para el corte 3 deben incorporarse hashing Argon2id, gestión persistente y revocación de sesiones, protección reforzada de datos y subida privada de imágenes. El login emite un token Bearer de una hora; la API restringe las operaciones privadas por paciente y rol. Las contraseñas siguen en texto plano únicamente por instrucción académica.

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
5. Para cambios administrativos usar una cuenta `admin` de prueba creada con `database/admin_setup_example.sql`, editando primero el correo y la contraseña ficticia. Para reservar una cita usar la cuenta del paciente y su token.

Las etiquetas visibles de Swagger están en español; los nombres de endpoints y campos JSON siguen en inglés conforme a buenas prácticas. Reinicia el servidor después de reemplazar el proyecto.

## Publicación en GitHub

Subir **el contenido de esta carpeta a la raíz del repositorio público**, sin una carpeta `MediCita_GitHub` adicional. No publicar `.env` ni `node_modules`. La variable `DB_PASSWORD` se configura únicamente en el `.env` local; `.env.example` no contiene contraseñas reales.

El enlace `http://localhost:5000/api-docs` es de uso local; para compartir documentación con terceros se requiere un despliegue público independiente.

## Correcciones de auditoría

- Validación de citas dentro de `doctor_schedules` (lunes=1, domingo=0) y rechazo de solapamientos.
- Rutas privadas con token Bearer; las consultas de paciente se restringen a su identidad.
- Reseñas visibles solo para su paciente asociado o administradores.
- Rangos numéricos con mínimo <= máximo y valores clínicos finitos; se admiten negativos.
- Swagger y Postman describen/usan tokens; la colección captura automáticamente `authToken` del login.
- Para probar operaciones administrativas existe `database/admin_setup_example.sql`; NO usar contraseñas reales.

**Estado de validación:** las pruebas automáticas locales comprueban sintaxis y utilidades; las pruebas contra MySQL y los casos de éxito/error por endpoint deben ejecutarse en tu computador y guardarse como evidencia real.


## Funciones añadidas tras auditoría

- `GET /api/doctors`: catálogo público de profesionales activos con especialidad y franjas registradas.
- `GET /api/doctors/:id/availability?date=YYYY-MM-DD`: franjas libres de 30 minutos calculadas en la zona horaria académica de Colombia.
- `GET /api/patients?search=texto`: filtro por nombre/correo (administrador).
- `GET /api/appointments?date=YYYY-MM-DD`: agenda diaria (administrador; un paciente solo consulta sus propias citas).
- `GET /api/medical-results/:id/image`: descarga de archivo privado bajo `private_images/` cuando existe; nunca se sirve directamente una ruta arbitraria del cliente.
- Las citas en fechas pasadas se rechazan. Swagger retira PATCH/DELETE de usuarios: el servicio no admite esas operaciones.

Los archivos de imágenes se incorporan localmente en `private_images/` usando nombres simples como `radiografia-demo.jpg`, y se guardan por referencia en `imaging_results.image_path`. Por seguridad esta carpeta está excluida de Git. Un archivo de demostración debe ser ficticio.

**Importante:** ejecutar las pruebas de integración manuales en una instancia local de MySQL. Los tests `npm test` no demuestran funcionamiento completo de la base de datos ni validan todos los endpoints. El servidor y las credenciales deben permanecer privados; esta API es únicamente académica.
