# Balanced Scorecard (BSC) — TechPeru SAC | 2025
## Solución Full-Stack Empresarial: Spring Boot 3 + Spring Modulith + Angular

Esta aplicación implementa un sistema empresarial completo de **Balanced Scorecard (Cuadro de Mando Integral)** adaptado con exactitud matemática a las métricas del archivo `resumen_bsc.csv` y al modelo oficial de **TechPeru SAC (2025)**.

---

## 1. Métricas Oficiales de Control (`resumen_bsc.csv`)

| Métrica | Valor Exacto | Detalle de Implementación |
| :--- | :--- | :--- |
| **Cumplimiento global** | **84.22777777777779%** | Promedio aritmético de los 36 KPIs (Estado: **⚠ EN RIESGO**) |
| **Objetivos Estratégicos** | **12** | 3 objetivos por cada una de las 4 perspectivas del BSC |
| **Indicadores KPI** | **36** | 11 Logrados (≥90%), 19 En riesgo (75–89.9%), 6 Críticos (<75%) |
| **Iniciativas Estratégicas** | **8** | Proyectos con presupuesto (S/ 370,000), cronograma y avance |

---

## 2. Arquitectura de Software

### 2.1. Backend: Java 21 + Spring Boot 3.3.4 + Spring Modulith
Ubicado en `/backend`, estructurado bajo el paradigma de **Monolito Modular** con `org.springframework.modulith`:
- **`com.empresa.bsc.shared`** (`@ApplicationModule(type = Type.OPEN)`):
  - Enumeraciones: `PerspectiveType`, `KpiDirection`, `TrafficLightStatus`, `RoleType`.
  - DTOs globales (`ApiResponse<T>`) y `@RestControllerAdvice`.
  - Utilidades para exportación de CSV (`;`) y Microsoft Excel (`.xlsx` con Apache POI).
- **`com.empresa.bsc.iam`**:
  - Control de accesos y usuarios demo (`ADMIN`, `GERENTE`, `RESPONSABLE`).
  - Seguridad con **Spring Security 6 + JWT stateless**.
- **`com.empresa.bsc.strategy`**:
  - Catálogo de las 4 perspectivas y 12 objetivos estratégicos.
  - Relaciones de causa-efecto (`StrategyLink`) para el Mapa Estratégico.
- **`com.empresa.bsc.kpi`**:
  - Gestión de los 36 KPIs, fórmulas directa/inversa y registro de mediciones mensuales.
  - **Evento desacoplado:** Publicación de `KpiMeasurementRecordedEvent` vía `ApplicationEventPublisher` al registrar mediciones.
- **`com.empresa.bsc.initiatives`**:
  - Portafolio de 8 proyectos, presupuestos en Soles (S/), avance y enlaces con KPIs.
- **`com.empresa.bsc.analytics`**:
  - Listener de eventos (`@ApplicationModuleListener`) y consolidación del Dashboard.
  - Cálculo del índice global (84.22777777777779%) y matriz en 4 cuadrantes.
  - Generación de reportes CSV y Excel (.xlsx).
- **Verificación Modular:** Test automatizado con `ApplicationModules.of(BscApplication.class).verify()`.

### 2.2. Frontend: Angular 19+ (Standalone + Signals)
Ubicado en `/frontend`:
- Componentes 100% `standalone`.
- Gestión de estado reactivo moderno con **Angular Signals (`signal`, `computed`)**.
- `HttpClient` con `HttpInterceptorFn` para inyección de token JWT.
- `CanActivateFn` para protección de rutas según rol.
- Visualizaciones gráficas con **Chart.js**: tendencia mensual 2025 y barras por perspectiva.
- Estilos corporativos tipo ERP/BI con paleta slate/blue y semáforos normados.

---

## 3. Instrucciones de Ejecución

### Opción Rápida (Windows)
Ejecuta con doble clic el script en la raíz del proyecto:
- **`start-all.bat`**: Inicia tanto el backend como el frontend en ventanas simultáneas.

O ejecuta cada servicio de forma individual:
- **`run-backend.bat`**: Levanta el backend en `http://localhost:8080`.
- **`run-frontend.bat`**: Levanta el frontend en `http://localhost:4200`.

### Ejecución Manual desde Terminal

#### 1. Iniciar el Backend (Java 21 + Maven)
```powershell
cd backend
mvn spring-boot:run
```
- API REST: `http://localhost:8080/api/analytics/dashboard`
- Documentación Swagger / OpenAPI: `http://localhost:8080/swagger-ui.html`
- Consola H2 Database: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:bscdb`, Usuario: `sa`, Contraseña vacía)

#### 2. Iniciar el Frontend (Angular)
```powershell
cd frontend
npm start
```
- Aplicación Web: `http://localhost:4200`

#### 3. Ejecutar Base de Datos PostgreSQL (Opcional para Producción)
```powershell
docker compose up -d
```

---

## 4. Credenciales de Demostración

| Rol | Correo Electrónico | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@demo.com` | `BSC2026!` | Acceso total: CRUD, auditoría, configuración |
| **Gerente** | `gerente@demo.com` | `BSC2026!` | Edición estratégica, KPIs, iniciativas y mediciones |
| **Responsable** | `responsable@demo.com` | `BSC2026!` | Consulta y registro de mediciones mensuales |

---

## 5. Pruebas Automatizadas

Para validar las reglas de arquitectura modular y la concordancia de métricas con `resumen_bsc.csv`:
```powershell
cd backend
mvn test
```
Resultados de las pruebas:
- `BscModulithArchitectureTests.verifyModularArchitecture`: **PASS** (Zero violaciones de encapsulamiento).
- `BscApplicationContextTest.contextLoadsAndMetricsMatchCsv`: **PASS** (12 objetivos, 36 KPIs, 8 iniciativas, 84.22777777777779% cumplimiento).
