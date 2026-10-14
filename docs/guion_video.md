# Demostración API (máximo 5 minutos)

Grabar la pantalla de Postman o Swagger UI; no mostrar Visual Studio Code ni explicar la arquitectura.

1. **00:00–00:30** Abrir la documentación `http://localhost:5000/api-docs` y listar especialidades (`GET /api/specialties`).
2. **00:30–01:15** Crear paciente (`POST /api/patients`) y usuario (`POST /api/users`). Ejecutar el login (`POST /api/auth/login`) con las credenciales correctas.
3. **01:15–02:00** Crear médico y mostrar listado (`POST /api/doctors`, `GET /api/doctors`).
4. **02:00–02:45** Agendar cita (`POST /api/appointments`), consultar por ID y cambiar su estado a `completed`.
5. **02:45–03:30** Crear reseña de esa cita. Agregar una etiqueta si ya existe una etiqueta en el catálogo.
6. **03:30–04:20** Crear resultado numérico y consultar su detalle. Mostrar listado filtrado por `patientId` y `type`.
7. **04:20–04:50** Mostrar un error real: intentar reservar la misma franja horaria o enviar una calificación `7`; el API debe responder 409 o 400, respectivamente.

Al grabar, utilizar usuarios, médicos y pacientes **ficticios**. Subir el video a YouTube como público o no listado; probar el vínculo en incógnito antes de entregarlo.
