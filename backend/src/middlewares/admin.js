import 'dotenv/config'

export const adminOnly = (req, _res, next) => {
  const userId = req.user?.id || req.headers['x-user-id']
  if (!userId) return next({ status: 401, message: 'No autorizado' })
  if (String(userId) !== String(process.env.ADMIN_USER_ID)) {
    return next({ status: 403, message: 'Acceso solo para administrador' })
  }
  next()
}


