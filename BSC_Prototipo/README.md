# Balanced Scorecard Ampliado — TechPeru SAC | 2025
## Prototipo Interactivo y Funcional de Gestión Estratégica Empresarial

Este prototipo interactivo implementa con exactitud el modelo de **Balanced Scorecard (BSC)** de la empresa **TechPeru SAC (Período 2025)**, adaptado a partir del libro y modelo Excel proporcionado por la cátedra.

---

## 1. Estructura del Sistema y Contenido
- **4 Perspectivas Oficiales del BSC:** Financiera, Clientes, Procesos Internos, Aprendizaje y Crecimiento.
- **12 Objetivos Estratégicos:** 3 objetivos por perspectiva con relaciones de causa y efecto.
- **36 Indicadores KPI:** 9 KPIs por perspectiva con metas, valores reales acumulados, unidades, frecuencias, sentidos y fórmulas de cálculo.
- **8 Iniciativas Estratégicas:** Proyectos con presupuesto, cronograma, avance porcentual y estado, vinculados a los KPIs más críticos.
- **Índice Global de Cumplimiento:** **84.2% (En riesgo)**, exactamente equivalente al promedio oficial de los 36 KPIs:
  - **11 Logrados (≥ 90%)**
  - **19 En riesgo (75% a 89.9%)**
  - **6 Críticos (< 75%)**

---

## 2. Cómo Ejecutar la Aplicación
1. Abre directamente el archivo `index.html` en cualquier navegador web moderno (Google Chrome, Microsoft Edge, Mozilla Firefox o Safari).
2. **No requiere instalación de software ni servidor local** (funciona como Single Page Application autónoma con persistencia en `localStorage`).
3. **Credenciales de Demostración:**
   - **Administrador:** `admin@demo.com` / `BSC2026!` (Acceso total: CRUD de objetivos, KPIs, iniciativas, usuarios y configuración).
   - **Gerente:** `gerente@demo.com` / `BSC2026!` (Edición de objetivos, KPIs, iniciativas y registro de mediciones).
   - **Responsable de Indicadores:** `responsable@demo.com` / `BSC2026!` (Registro y consulta de mediciones y fichas técnicas).

---

## 3. Módulos Implementados

1. **Inicio de Sesión:** Acceso por roles, validación interactiva y cierre de sesión.
2. **Dashboard Ejecutivo:**
   - 4 tarjetas métricas con el índice global (84.2%), objetivos, KPIs cumplidos y críticos.
   - Gráfico de barras por perspectiva y gráfico de líneas con tendencia mensual 2025.
   - **Matriz Ejecutiva en 4 Cuadrantes:** Reproduce visualmente la hoja `📈 Dashboard` del Excel con los 36 KPIs evaluados simultáneamente.
   - Tabla de indicadores críticos con sus recomendaciones estratégicas.
3. **BSC Completo (36 KPIs):** Vista tabular equivalente a la hoja `📊 BSC Completo` del Excel, con filtrado por perspectiva, estado, sentido de medición y buscador en tiempo real.
4. **Mapa Estratégico:** Representación gráfica de causa y efecto en cascada vertical (Aprendizaje → Procesos → Clientes → Financiera) con nodos seleccionables para inspección.
5. **Gestión de Objetivos:** Listado y operaciones CRUD (crear, editar, eliminar) para los 12 objetivos estratégicos.
6. **Catálogo de Indicadores (KPI):** Fichas técnicas, fórmulas, metas, línea base y modal con historial gráfico.
7. **Registro de Resultados (Mediciones):** Formulario para registrar valores reales por período. Al guardar, se actualiza el semáforo, el valor actual y el cumplimiento global en tiempo real.
8. **Iniciativas Estratégicas:** Gestión del portafolio de 8 proyectos, avance porcentual (0–100%), presupuesto y responsables.
9. **Reportes y Exportación:** Generación de 6 reportes ejecutivos, exportación a archivo CSV compatible con Excel e impresión formateada lista para guardar como PDF.
10. **Administración:** Gestión de usuarios demo, período de evaluación, catálogo de áreas, respaldo JSON y restauración del demo original.

---

## 4. Reglas de Negocio y Semáforo

### Criterios de Evaluación
- **Verde (✅ Logrado):** Cumplimiento $\ge 90\%$
- **Ámbar (⚠ En riesgo):** Cumplimiento entre $75\%$ y $89.9\%$
- **Rojo (❌ Crítico):** Cumplimiento $< 75\%$

### Fórmulas de Cumplimiento
- **Sentido Mayor es mejor (Directo):**
  $$\text{Cumplimiento} = \left(\frac{\text{Resultado Real}}{\text{Meta Anual}}\right) \times 100$$
- **Sentido Menor es mejor (Inverso: CAC, Costos, Defectos, Tiempos, Churn, Incidencias, Rotación):**
  $$\text{Cumplimiento} = \left(\frac{\text{Meta Anual}}{\text{Resultado Real}}\right) \times 100$$
  *(Controlando división por cero y valores negativos)*.

### Cumplimiento Global
Promedio aritmético de los 36 KPIs evaluados:
$$\text{Cumplimiento Global} = \frac{\sum_{i=1}^{36} \text{Cumplimiento}_i}{36} = 84.2\% \quad (\text{En riesgo})$$

---

## 5. Arquitectura Técnica y Persistencia
- **Tecnologías:** HTML5 semántico, CSS3 corporativo (diseño responsivo y adaptado para impresión) y JavaScript ES6 modular nativo.
- **Gráficos:** Chart.js 4.4 vía CDN (con fallback en caso de navegación offline).
- **Persistencia:** `localStorage` (`bsc_techperu_2025_v3`) para conservar todos los cambios entre recargas del navegador.
- **Validación de código:** Verificado exitosamente con `node --check js/app.js`.
