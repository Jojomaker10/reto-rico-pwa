import 'dotenv/config'

export const adminOnly = (req, _res, next) => {
  const email = req.user?.email || req.headers['x-user-email']
  if (!email) return next({ status: 401, message: 'No autorizado' })
  if (String(email).toLowerCase() !== String(process.env.ADMIN_EMAIL).toLowerCase()) {
    return next({ status: 403, message: 'Acceso solo para administrador' })
  }
  next()
}


