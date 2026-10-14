const pool = require('../config/database');
const repo = require('../repositories/base.repository');
const v = require('../utils/validate');
const { ApiError } = require('../utils/errors');
const statuses = ['scheduled', 'completed', 'cancelled'];
async function list(patientId) {
  const [rows] = patientId
    ? await pool.query('SELECT * FROM appointments WHERE patient_id = ? ORDER BY starts_at DESC', [v.id(patientId)])
    : await pool.query('SELECT * FROM appointments ORDER BY starts_at DESC');
  return rows;
}
async function get(id) { const item = await repo.one('appointments', v.id(id)); if (!item) throw new ApiError(404, 'Cita no encontrada'); return item; }
async function create(body) {
  const patientId = v.id(body.patient_id), doctorId = v.id(body.doctor_id), startsAt = v.dateTime(body.starts_at);
  const durationMinutes = v.integer(body.duration_minutes ?? 30, 'duration_minutes');
  if (durationMinutes > 240) throw new ApiError(400, 'Duración máxima: 240 minutos');
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [[patient]] = await connection.query('SELECT id FROM patients WHERE id = ?', [patientId]);
    const [[doctor]] = await connection.query('SELECT consultation_price, active FROM doctors WHERE id = ? FOR UPDATE', [doctorId]);
    if (!patient || !doctor || !doctor.active) throw new ApiError(400, 'Paciente o médico no disponible');
    const [conflicts] = await connection.query(`SELECT id FROM appointments WHERE doctor_id = ? AND status <> 'cancelled' AND starts_at < DATE_ADD(?, INTERVAL ? MINUTE) AND DATE_ADD(starts_at, INTERVAL duration_minutes MINUTE) > ? LIMIT 1`, [doctorId, startsAt, durationMinutes, startsAt]);
    if (conflicts.length) throw new ApiError(409, 'El médico ya tiene una cita en ese horario');
    const [result] = await connection.query('INSERT INTO appointments (patient_id, doctor_id, starts_at, duration_minutes, price_at_booking, status) VALUES (?, ?, ?, ?, ?, ?)', [patientId, doctorId, startsAt, durationMinutes, doctor.consultation_price, 'scheduled']);
    await connection.commit();
    return get(result.insertId);
  } catch (error) { await connection.rollback(); throw error; }
  finally { connection.release(); }
}
async function edit(id, body) {
  const current = await get(id);
  const status = v.choice(body?.status, 'status', statuses);
  if (current.status === 'completed' && status !== 'completed') throw new ApiError(409, 'Una cita atendida no puede reabrirse');
  await repo.update('appointments', Number(id), { status });
  return get(id);
}
async function erase(id) { await get(id); await repo.remove('appointments', Number(id)); }
module.exports = { list, get, create, edit, erase };
