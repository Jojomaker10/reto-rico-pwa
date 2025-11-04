# 🚀 Crear Edge Functions en Supabase - Paso a Paso

## 📍 Desde tu Link
https://supabase.com/dashboard/project/sopvzvcfswxvpytsvner/functions

---

## ✅ Función 1: `deposits`

### Paso 1: Crear Nueva Función
1. Ve a: https://supabase.com/dashboard/project/sopvzvcfswxvpytsvner/functions
2. Haz clic en el botón **"Create a new function"** o **"New function"**
3. Si te pide un nombre, escribe: `deposits` (en minúsculas, sin espacios)

### Paso 2: Copiar el Código
1. Abre el archivo en tu proyecto: `CODIGO_PARA_COPIAR/deposits.ts`
   - O desde: `supabase/functions/deposits/index.ts`
2. Selecciona TODO el contenido (Ctrl+A)
3. Copia (Ctrl+C)
4. En el editor de Supabase, borra cualquier código que esté ahí
5. Pega el código copiado (Ctrl+V)

### Paso 3: Desplegar
1. Haz clic en **"Deploy"** o **"Save"** (botón verde o azul)
2. Espera 30-60 segundos mientras se despliega
3. Verás un mensaje de éxito: ✅ "Function deployed successfully"

---

## ✅ Función 2: `withdrawals`

### Paso 1: Crear Nueva Función
1. Haz clic nuevamente en **"Create a new function"** o **"New function"**
2. Nombre: `withdrawals` (en minúsculas)

### Paso 2: Copiar el Código
1. Abre: `CODIGO_PARA_COPIAR/withdrawals.ts`
   - O desde: `supabase/functions/withdrawals/index.ts`
2. Selecciona TODO (Ctrl+A)
3. Copia (Ctrl+C)
4. Pega en el editor de Supabase (Ctrl+V)

### Paso 3: Desplegar
1. Haz clic en **"Deploy"**
2. Espera 30-60 segundos

---

## ✅ Función 3: `admin`

### Paso 1: Crear Nueva Función
1. Haz clic nuevamente en **"Create a new function"** o **"New function"**
2. Nombre: `admin` (en minúsculas)

### Paso 2: Copiar el Código
1. Abre: `CODIGO_PARA_COPIAR/admin.ts`
   - O desde: `supabase/functions/admin/index.ts`
2. Selecciona TODO (Ctrl+A)
3. Copia (Ctrl+C)
4. Pega en el editor de Supabase (Ctrl+V)

### Paso 3: Desplegar
1. Haz clic en **"Deploy"**
2. Espera 30-60 segundos

---

## ✅ Verificación Final

Después de crear las 3 funciones, deberías ver en la lista:

1. ✅ `deposits` - Estado: Active
2. ✅ `withdrawals` - Estado: Active
3. ✅ `admin` - Estado: Active

---

## 📝 Notas Importantes

- **Nombres exactos**: Los nombres deben ser exactamente `deposits`, `withdrawals`, y `admin` (sin espacios, en minúsculas)
- **Código completo**: Asegúrate de copiar TODO el código de cada archivo
- **No modificar**: No cambies el código, solo copia y pega tal cual está

---

## 🐛 Si hay problemas

### Error: "Function name already exists"
- Ya existe una función con ese nombre
- Ve a la lista de funciones y elimina la existente primero
- O usa otro nombre (pero luego actualiza las rutas en el frontend)

### Error: "Syntax error"
- Verifica que copiaste TODO el código completo
- Asegúrate de no haber dejado nada fuera
- Revisa que no haya caracteres raros

### Error: "Deploy failed"
- Revisa los logs en Supabase (click en la función → Logs)
- Verifica que los secrets estén configurados (Settings → Edge Functions → Secrets)
- Asegúrate de haber configurado los 8 secrets antes de desplegar

### No encuentro el botón "Create function"
- Algunas veces está en la parte superior derecha
- O busca "New function" o "+ New"
- También puedes buscar "Deploy" en la barra de búsqueda

---

## 📋 Checklist Final

Después de crear las 3 funciones, verifica:

- [ ] ✅ `deposits` - Estado: Active
- [ ] ✅ `withdrawals` - Estado: Active  
- [ ] ✅ `admin` - Estado: Active

**¡Listo! Una vez creadas las 3 funciones, tu backend estará funcionando en Supabase.** 🎉

## 🔗 URLs de las Funciones

Una vez desplegadas, las funciones estarán disponibles en:
- `https://sopvzvcfswxvpytsvner.supabase.co/functions/v1/deposits`
- `https://sopvzvcfswxvpytsvner.supabase.co/functions/v1/withdrawals`
- `https://sopvzvcfswxvpytsvner.supabase.co/functions/v1/admin`

(El frontend ya está configurado para usar estas URLs automáticamente)

