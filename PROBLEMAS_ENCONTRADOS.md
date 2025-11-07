# 🔍 Problemas Encontrados en la Aplicación

## ⚠️ Problemas Críticos

### 1. **Error de Ruteo en App.jsx**
**Ubicación:** `src/App.jsx` línea 59-65

**Problema:** La ruta `/withdrawals` apunta al componente incorrecto.

```jsx
// ACTUAL (INCORRECTO):
<Route
  path="/withdrawals"
  element={
    <ProtectedRoute>
      <Withdraw />  // ❌ Debería ser <Withdrawals />
    </ProtectedRoute>
  }
/>
```

**Solución:** Debe apuntar a `<Withdrawals />` que es el componente completo con formulario e historial, no a `<Withdraw />` que es un componente simple.

---

### 2. **Inconsistencia en Variables de Entorno**
**Ubicación:** Múltiples archivos

**Problema:** Algunos archivos usan `VITE_SUPABASE_KEY` y otros `VITE_SUPABASE_ANON_KEY`.

**Archivos afectados:**
- `src/config/supabase.js` → usa `VITE_SUPABASE_KEY`
- `src/pages/Dashboard.jsx` → usa `VITE_SUPABASE_ANON_KEY`
- `src/utils/api.js` → usa `VITE_SUPABASE_KEY`
- `src/components/Benefits.jsx` → usa `VITE_SUPABASE_ANON_KEY`

**Solución:** Estandarizar a `VITE_SUPABASE_ANON_KEY` en todos los archivos.

---

### 3. **Inconsistencia en Campo de Balance**
**Ubicación:** `src/pages/Dashboard.jsx` y `src/pages/Withdrawals.jsx`

**Problema:** Se usa `user.balance_usd` en Dashboard pero `user.balance` en Withdrawals.

**Dashboard (línea 533):**
```jsx
{(user.balance_usd || 0).toFixed(2)} USD
```

**Withdrawals (línea 223):**
```jsx
const availableBalance = user?.balance || 0
```

**Solución:** Unificar el nombre del campo. Recomendación: usar `balance` en Supabase y convertir a USD cuando sea necesario.

---

### 4. **Uso de `useAuthStore.getState()` Bypass React**
**Ubicación:** `src/pages/Dashboard.jsx` línea 54 y `src/pages/SelectPack.jsx` línea 134

**Problema:** Se usa `.getState()` directamente, lo que bypassa la reactividad de React.

```jsx
// PROBLEMA:
const { getInvestments } = useAuthStore.getState()

// DEBERÍA SER:
const { getInvestments } = useAuthStore()
```

**Solución:** Usar el hook directamente en lugar de `.getState()`.

---

## 🔧 Problemas de UX/UI

### 5. **Falta NavBar en Páginas de Depósito y Retiro**
**Ubicación:** `src/pages/Deposit.jsx` y `src/pages/Withdraw.jsx`

**Problema:** Estas páginas no tienen el NavBar, mientras que otras páginas protegidas sí lo tienen.

**Solución:** Agregar `<NavBar />` a ambas páginas para consistencia.

---

### 6. **Falta Protección de Rutas en Admin**
**Ubicación:** `src/App.jsx` línea 69

**Problema:** La ruta `/admin` solo tiene `ProtectedRoute` pero no verifica si el usuario es admin.

**Solución:** Crear un `AdminProtectedRoute` que verifique el rol de admin.

---

### 7. **Validación de Dirección USDT Débil**
**Ubicación:** `src/pages/Withdrawals.jsx` línea 109

**Problema:** Solo valida longitud mínima (26 caracteres), no el formato real de direcciones TRC20 o ERC20.

```jsx
// ACTUAL:
else if (formData.usdtAddress.length < 26) {
  newErrors.usdtAddress = 'Dirección USDT inválida'
}
```

**Solución:** Agregar validación de formato (comienza con T para TRC20 o 0x para ERC20).

---

## 🐛 Problemas de Funcionalidad

### 8. **Manejo de Errores en API Calls**
**Ubicación:** `src/pages/Deposit.jsx` y `src/pages/Withdraw.jsx`

**Problema:** Los errores se muestran con `alert()` en lugar de componentes de UI consistentes.

**Solución:** Crear un sistema de notificaciones toast o usar componentes de error consistentes.

---

### 9. **Falta Validación de Autenticación en Algunas Páginas**
**Ubicación:** `src/pages/Deposit.jsx` y `src/pages/Withdraw.jsx`

**Problema:** Estas páginas no verifican explícitamente la autenticación al montar.

**Solución:** Agregar `useEffect` que redirija a login si no está autenticado, similar a otras páginas.

---

### 10. **Configuración de API para Edge Functions**
**Ubicación:** `src/utils/api.js`

**Problema:** La lógica del interceptor puede no funcionar correctamente para todas las rutas de Edge Functions.

**Solución:** Simplificar la lógica del interceptor o usar una configuración más clara.

---

## 📱 Problemas de PWA

### 11. **Service Worker Deshabilitado**
**Ubicación:** `vite.config.js` línea 3-20

**Problema:** El plugin de PWA está comentado.

**Solución:** Si quieres mantener la PWA funcional, descomentar y configurar correctamente.

---

## 🔐 Problemas de Seguridad

### 12. **Balance Actualizado Localmente en Withdrawals**
**Ubicación:** `src/pages/Withdrawals.jsx` línea 159-162

**Problema:** Se actualiza el balance directamente en Supabase sin verificar que la actualización fue exitosa antes de continuar.

```jsx
// Actualiza balance sin verificar éxito
await supabase
  .from('profiles')
  .update({ balance: user.balance - amount })
  .eq('id', user.id)
```

**Solución:** Verificar que la actualización fue exitosa y manejar errores apropiadamente.

---

### 13. **Falta Validación de 2FA en Withdraw**
**Ubicación:** `src/pages/Withdraw.jsx`

**Problema:** El campo de código 2FA no tiene validación ni verificación real.

**Solución:** Implementar validación real de 2FA o remover el campo si no se usa.

---

## 🎨 Problemas de Diseño

### 14. **Estilos Inconsistentes en Formularios**
**Ubicación:** Múltiples páginas

**Problema:** Los formularios usan diferentes estilos de inputs y botones.

**Solución:** Crear componentes reutilizables para inputs y botones.

---

### 15. **Falta Feedback Visual en Operaciones**
**Ubicación:** Varias páginas

**Problema:** Muchas operaciones no muestran estados de carga consistentes.

**Solución:** Implementar un sistema de loading states uniforme.

---

## 📋 Resumen de Prioridades

### 🔴 Alta Prioridad (Arreglar Ahora)
1. Error de ruteo `/withdrawals` (Problema #1)
2. Inconsistencia en variables de entorno (Problema #2)
3. Inconsistencia en campo balance (Problema #3)

### 🟡 Media Prioridad (Arreglar Pronto)
4. Uso de `.getState()` (Problema #4)
5. Falta NavBar en páginas (Problema #5)
6. Validación de dirección USDT (Problema #7)
7. Manejo de errores mejorado (Problema #8)

### 🟢 Baja Prioridad (Mejoras)
8. Protección de rutas admin (Problema #6)
9. Validación de autenticación (Problema #9)
10. Configuración de API (Problema #10)
11. Service Worker (Problema #11)
12. Seguridad en actualización de balance (Problema #12)
13. Validación 2FA (Problema #13)
14. Estilos consistentes (Problema #14)
15. Feedback visual (Problema #15)

---

## 🚀 Próximos Pasos

1. **Arreglar los 3 problemas de alta prioridad primero**
2. **Probar la aplicación después de cada fix**
3. **Continuar con los problemas de media prioridad**
4. **Planificar mejoras de baja prioridad para futuras iteraciones**

