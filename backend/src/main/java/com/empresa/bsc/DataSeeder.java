package com.empresa.bsc;

import com.empresa.bsc.iam.model.AuditLog;
import com.empresa.bsc.iam.model.User;
import com.empresa.bsc.iam.repository.AuditLogRepository;
import com.empresa.bsc.iam.repository.UserRepository;
import com.empresa.bsc.initiatives.model.StrategicInitiative;
import com.empresa.bsc.initiatives.repository.InitiativeRepository;
import com.empresa.bsc.kpi.model.Kpi;
import com.empresa.bsc.kpi.model.KpiMeasurement;
import com.empresa.bsc.kpi.repository.KpiMeasurementRepository;
import com.empresa.bsc.kpi.repository.KpiRepository;
import com.empresa.bsc.kpi.service.KpiCalculationEngine;
import com.empresa.bsc.shared.enums.KpiDirection;
import com.empresa.bsc.shared.enums.PerspectiveType;
import com.empresa.bsc.shared.enums.RoleType;
import com.empresa.bsc.strategy.model.Perspective;
import com.empresa.bsc.strategy.model.StrategicObjective;
import com.empresa.bsc.strategy.model.StrategyLink;
import com.empresa.bsc.strategy.repository.ObjectiveRepository;
import com.empresa.bsc.strategy.repository.PerspectiveRepository;
import com.empresa.bsc.strategy.repository.StrategyLinkRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final PerspectiveRepository perspectiveRepository;
    private final ObjectiveRepository objectiveRepository;
    private final StrategyLinkRepository strategyLinkRepository;
    private final KpiRepository kpiRepository;
    private final KpiMeasurementRepository measurementRepository;
    private final InitiativeRepository initiativeRepository;
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final KpiCalculationEngine calculationEngine;

    @Override
    @Transactional
    public void run(String... args) {
        if (kpiRepository.count() > 0) {
            log.info("ℹ Datos iniciales ya existen en la base de datos.");
            return;
        }

        log.info("🚀 Inicializando base de datos con el modelo Balanced Scorecard (TechPeru SAC 2025)...");

        seedUsers();
        seedPerspectives();
        seedObjectives();
        seedStrategyLinks();
        seedKpisAndMeasurements();
        seedInitiatives();
        seedAudit();

        log.info("✅ Carga completa: 4 perspectivas, 12 objetivos, 36 KPIs, 8 iniciativas y 5 usuarios.");
    }

    private void seedUsers() {
        String encodedPass = passwordEncoder.encode("BSC2026!");
        List<User> users = List.of(
                User.builder().id("u1").name("Ana Pérez").email("admin@demo.com").password(encodedPass).role(RoleType.ROLE_ADMIN).area("Gerencia General").build(),
                User.builder().id("u2").name("Carlos Ruiz").email("gerente@demo.com").password(encodedPass).role(RoleType.ROLE_GERENTE).area("Gerencia Comercial").build(),
                User.builder().id("u3").name("María Torres").email("responsable@demo.com").password(encodedPass).role(RoleType.ROLE_RESPONSABLE).area("Operaciones").build(),
                User.builder().id("u4").name("Luis Quispe").email("luis.quispe@demo.com").password(encodedPass).role(RoleType.ROLE_RESPONSABLE).area("Finanzas").build(),
                User.builder().id("u5").name("Rosa Medina").email("rosa.medina@demo.com").password(encodedPass).role(RoleType.ROLE_GERENTE).area("Talento Humano").build()
        );
        userRepository.saveAll(users);
    }

    private void seedPerspectives() {
        List<Perspective> perspectives = List.of(
                Perspective.builder().code("FIN").type(PerspectiveType.FINANCIERA).label("Financiera").color("#1d4ed8").softColor("#eff6ff").icon("💰").displayOrder(1).build(),
                Perspective.builder().code("CLI").type(PerspectiveType.CLIENTES).label("Clientes").color("#0d9488").softColor("#f0fdfa").icon("👥").displayOrder(2).build(),
                Perspective.builder().code("PRO").type(PerspectiveType.PROCESOS).label("Procesos internos").color("#d97706").softColor("#fffbeb").icon("🔧").displayOrder(3).build(),
                Perspective.builder().code("APR").type(PerspectiveType.APRENDIZAJE).label("Aprendizaje y crecimiento").color("#7c3aed").softColor("#f5f3ff").icon("📚").displayOrder(4).build()
        );
        perspectiveRepository.saveAll(perspectives);
    }

    private void seedObjectives() {
        List<StrategicObjective> objs = List.of(
                // Financiera
                StrategicObjective.builder().id("OBJ-F1").name("Incrementar la Rentabilidad").perspective(PerspectiveType.FINANCIERA).description("Maximizar el retorno del patrimonio y la utilidad neta mejorando márgenes operativos.").owner("Ana Pérez").priority("Alta").weight(35.0).status("Activo").created("2025-01-05").build(),
                StrategicObjective.builder().id("OBJ-F2").name("Acelerar el Crecimiento de Ingresos").perspective(PerspectiveType.FINANCIERA).description("Elevar la facturación anual acelerando el pipeline comercial y lanzando nuevas soluciones.").owner("Carlos Ruiz").priority("Alta").weight(35.0).status("Activo").created("2025-01-05").build(),
                StrategicObjective.builder().id("OBJ-F3").name("Optimizar la Estructura de Costos").perspective(PerspectiveType.FINANCIERA).description("Reducir ratio operativo, controlar el CAC y aumentar la productividad de los activos.").owner("Luis Quispe").priority("Media").weight(30.0).status("Activo").created("2025-01-05").build(),

                // Clientes
                StrategicObjective.builder().id("OBJ-C1").name("Maximizar la Satisfacción del Cliente").perspective(PerspectiveType.CLIENTES).description("Alcanzar altos índices de NPS y satisfacción post-venta con resolución inmediata de quejas.").owner("Carlos Ruiz").priority("Alta").weight(35.0).status("Activo").created("2025-01-05").build(),
                StrategicObjective.builder().id("OBJ-C2").name("Aumentar la Retención y Fidelización").perspective(PerspectiveType.CLIENTES).description("Retener la cartera corporativa, elevar la recompra recurrente y mitigar la tasa de abandono.").owner("Carlos Ruiz").priority("Alta").weight(35.0).status("Activo").created("2025-01-05").build(),
                StrategicObjective.builder().id("OBJ-C3").name("Expandir la Base de Clientes").perspective(PerspectiveType.CLIENTES).description("Conquistar nuevos clientes B2B, ampliar la cuota de mercado y optimizar el costo por lead.").owner("Ana Pérez").priority("Media").weight(30.0).status("Activo").created("2025-01-05").build(),

                // Procesos Internos
                StrategicObjective.builder().id("OBJ-P1").name("Excelencia en Operaciones y Calidad").perspective(PerspectiveType.PROCESOS).description("Cumplir entregas oportunas, minimizar defectos y quejas, y elevar la productividad por empleado.").owner("María Torres").priority("Alta").weight(35.0).status("Activo").created("2025-01-05").build(),
                StrategicObjective.builder().id("OBJ-P2").name("Innovación y Desarrollo de Producto").perspective(PerspectiveType.PROCESOS).description("Acelerar el time-to-market y asegurar que los nuevos lanzamientos representen mayores ventas.").owner("Carlos Ruiz").priority("Alta").weight(35.0).status("Activo").created("2025-01-05").build(),
                StrategicObjective.builder().id("OBJ-P3").name("Gestión Eficiente de Proveedores").perspective(PerspectiveType.PROCESOS).description("Garantizar cumplimiento de proveedores (OTD), reducir no conformidades y optimizar stock.").owner("María Torres").priority("Media").weight(30.0).status("Activo").created("2025-01-05").build(),

                // Aprendizaje y Crecimiento
                StrategicObjective.builder().id("OBJ-A1").name("Desarrollar el Capital Humano").perspective(PerspectiveType.APRENDIZAJE).description("Fortalecer competencias clave y asegurar cobertura de planes de desarrollo individual.").owner("Rosa Medina").priority("Alta").weight(35.0).status("Activo").created("2025-01-05").build(),
                StrategicObjective.builder().id("OBJ-A2").name("Fortalecer la Cultura y el Clima").perspective(PerspectiveType.APRENDIZAJE).description("Mejorar la satisfacción laboral, completar evaluaciones y contener la rotación de talento.").owner("Rosa Medina").priority("Alta").weight(35.0).status("Activo").created("2025-01-05").build(),
                StrategicObjective.builder().id("OBJ-A3").name("Impulsar la Innovación Organizacional").perspective(PerspectiveType.APRENDIZAJE).description("Fomentar proyectos Kaizen, invertir en I+D y canalizar ideas aplicadas de colaboradores.").owner("Rosa Medina").priority("Media").weight(30.0).status("Activo").created("2025-01-05").build()
        );
        objectiveRepository.saveAll(objs);
    }

    private void seedStrategyLinks() {
        List<StrategyLink> links = List.of(
                StrategyLink.builder().id("LNK-01").sourceObjectiveId("OBJ-A1").targetObjectiveId("OBJ-P1").description("Capacitación y desarrollo potencian la excelencia operativa").strength("Alta").build(),
                StrategyLink.builder().id("LNK-02").sourceObjectiveId("OBJ-A1").targetObjectiveId("OBJ-P2").description("Desarrollo de competencias técnicas acelera la innovación de producto").strength("Alta").build(),
                StrategyLink.builder().id("LNK-03").sourceObjectiveId("OBJ-A2").targetObjectiveId("OBJ-P1").description("Clima laboral positivo y menor rotación reducen errores y tiempos").strength("Alta").build(),
                StrategyLink.builder().id("LNK-04").sourceObjectiveId("OBJ-A3").targetObjectiveId("OBJ-P2").description("Cultura de innovación e ideas alimentan nuevos productos").strength("Media").build(),
                StrategyLink.builder().id("LNK-05").sourceObjectiveId("OBJ-P1").targetObjectiveId("OBJ-C1").description("Entregas oportunas y cero defectos maximizan satisfacción y NPS").strength("Alta").build(),
                StrategyLink.builder().id("LNK-06").sourceObjectiveId("OBJ-P1").targetObjectiveId("OBJ-C2").description("Calidad consistente asegura fidelización de clientes clave").strength("Alta").build(),
                StrategyLink.builder().id("LNK-07").sourceObjectiveId("OBJ-P2").targetObjectiveId("OBJ-C3").description("Nuevos productos tecnológicos atraen nuevos segmentos comerciales").strength("Alta").build(),
                StrategyLink.builder().id("LNK-08").sourceObjectiveId("OBJ-P3").targetObjectiveId("OBJ-F3").description("Gestión eficiente de proveedores optimiza costos de inventario").strength("Media").build(),
                StrategyLink.builder().id("LNK-09").sourceObjectiveId("OBJ-C1").targetObjectiveId("OBJ-F1").description("Clientes satisfechos aumentan margen EBITDA y rentabilidad").strength("Alta").build(),
                StrategyLink.builder().id("LNK-10").sourceObjectiveId("OBJ-C2").targetObjectiveId("OBJ-F2").description("Mayor retención y recompra generan crecimiento de ingresos").strength("Alta").build(),
                StrategyLink.builder().id("LNK-11").sourceObjectiveId("OBJ-C3").targetObjectiveId("OBJ-F2").description("Expansión de clientes apalanca ingresos totales anuales").strength("Alta").build()
        );
        strategyLinkRepository.saveAll(links);
    }

    private void seedKpisAndMeasurements() {
        Object[][] rawData = new Object[][]{
                // FINANCIERA (9 KPIs)
                {"KPI-F01", "ROE – Retorno sobre Patrimonio", PerspectiveType.FINANCIERA, "OBJ-F1", "%", "(Utilidad Neta / Patrimonio Neto) × 100", 15.0, 18.0, 16.5, KpiDirection.MAYOR_MEJOR, "Trimestral", "Ana Pérez", "Finanzas", 1.0, "ROE por debajo del 18% meta. Revisar estructura de capital y palanca financiera."},
                {"KPI-F02", "Margen EBITDA", PerspectiveType.FINANCIERA, "OBJ-F1", "%", "(EBITDA / Ventas Totales) × 100", 18.0, 22.0, 19.8, KpiDirection.MAYOR_MEJOR, "Mensual", "Luis Quispe", "Finanzas", 1.0, "Margen comprimido por costos operativos. Plan de reducción de gastos en Q3-Q4."},
                {"KPI-F03", "Utilidad Neta Anual", PerspectiveType.FINANCIERA, "OBJ-F1", "S/ MM", "Ingresos Totales - Costos y Gastos - Impuestos", 1.6, 2.1, 1.869, KpiDirection.MAYOR_MEJOR, "Mensual", "Luis Quispe", "Finanzas", 1.0, "Utilidad neta al 89% de la meta. Requiere incremento de márgenes o volumen."},
                {"KPI-F04", "Crecimiento de Ventas YoY", PerspectiveType.FINANCIERA, "OBJ-F2", "%", "((Ventas Actuales - Ventas Año Previo) / Ventas Año Previo) × 100", 10.0, 15.0, 12.3, KpiDirection.MAYOR_MEJOR, "Trimestral", "Carlos Ruiz", "Comercial", 1.0, "Crecimiento al 82% de la meta. Acelerar pipeline comercial y campañas de upsell."},
                {"KPI-F05", "Ingresos Totales Anuales", PerspectiveType.FINANCIERA, "OBJ-F2", "S/ MM", "Facturación neta acumulada en el año", 7.0, 8.5, 7.9, KpiDirection.MAYOR_MEJOR, "Mensual", "Carlos Ruiz", "Comercial", 1.0, "Ingresos 7.2% por debajo de meta. Revisar estrategia de precios y mix de productos."},
                {"KPI-F06", "Ingresos por Nuevos Productos", PerspectiveType.FINANCIERA, "OBJ-F2", "%", "(Facturación Productos Nuevos / Facturación Total) × 100", 12.0, 20.0, 15.6, KpiDirection.MAYOR_MEJOR, "Trimestral", "Carlos Ruiz", "Comercial", 1.0, "Nuevos productos aportan 15.6% vs. 20% meta. Acelerar lanzamiento de Pipeline Q3."},
                {"KPI-F07", "Ratio Costo Operativo / Ingreso", PerspectiveType.FINANCIERA, "OBJ-F3", "%", "(Gastos Operativos / Ingresos Operacionales) × 100", 62.0, 55.0, 58.2, KpiDirection.MENOR_MEJOR, "Mensual", "Luis Quispe", "Finanzas", 1.0, "Ratio de costo elevado (58.2% vs 55% meta). Automatizar procesos para reducir costos."},
                {"KPI-F08", "Costo de Adquisición de Cliente (CAC)", PerspectiveType.FINANCIERA, "OBJ-F3", "S/", "(Gastos Marketing + Ventas) / Nuevos Clientes Captados", 450.0, 350.0, 412.0, KpiDirection.MENOR_MEJOR, "Mensual", "Carlos Ruiz", "Comercial", 1.0, "CAC de S/412 vs S/350 meta. Optimizar canales de adquisición digital."},
                {"KPI-F09", "Retorno sobre Activos (ROA)", PerspectiveType.FINANCIERA, "OBJ-F3", "%", "(Utilidad Neta / Activos Totales Promedio) × 100", 6.5, 9.0, 7.8, KpiDirection.MAYOR_MEJOR, "Trimestral", "Luis Quispe", "Finanzas", 1.0, "ROA bajo meta. Revisar eficiencia de activos y desinversión de activos ociosos."},

                // CLIENTES (9 KPIs)
                {"KPI-C01", "NPS – Net Promoter Score", PerspectiveType.CLIENTES, "OBJ-C1", "pts", "% Clientes Promotores - % Clientes Detractores", 50.0, 65.0, 58.0, KpiDirection.MAYOR_MEJOR, "Trimestral", "Carlos Ruiz", "Servicio al Cliente", 1.0, "NPS de 58 (meta 65). Implementar programa de seguimiento post-venta en 30/60/90 días."},
                {"KPI-C02", "CSAT – Satisfacción post-venta", PerspectiveType.CLIENTES, "OBJ-C1", "%", "(Calificaciones 4 y 5 / Total encuestados) × 100", 78.0, 88.0, 84.0, KpiDirection.MAYOR_MEJOR, "Mensual", "Carlos Ruiz", "Servicio al Cliente", 1.0, "CSAT al 95.5% de meta. Reforzar proceso de onboarding y soporte técnico."},
                {"KPI-C03", "Tiempo de Resolución de Quejas", PerspectiveType.CLIENTES, "OBJ-C1", "días", "Suma de días para resolver quejas / Total quejas cerradas", 4.5, 2.0, 2.8, KpiDirection.MENOR_MEJOR, "Mensual", "María Torres", "Operaciones", 1.0, "Tiempo de resolución 2.8 días vs. 2 días meta. Crear equipo dedicado de soporte nivel 2."},
                {"KPI-C04", "Tasa de Retención de Clientes", PerspectiveType.CLIENTES, "OBJ-C2", "%", "((Clientes Finales - Nuevos Clientes) / Clientes Iniciales) × 100", 80.0, 90.0, 87.0, KpiDirection.MAYOR_MEJOR, "Trimestral", "Carlos Ruiz", "Comercial", 1.0, "Retención al 96.7% de meta. Lanzar programa de fidelización con descuentos por volumen."},
                {"KPI-C05", "Tasa de Recompra (Repeat Purchase)", PerspectiveType.CLIENTES, "OBJ-C2", "%", "(Clientes con >1 compra en el período / Clientes Activos) × 100", 40.0, 55.0, 49.0, KpiDirection.MAYOR_MEJOR, "Mensual", "Carlos Ruiz", "Comercial", 1.0, "Recompra al 89% de meta. Implementar campañas de re-engagement a los 90 días."},
                {"KPI-C06", "Churn Rate (Tasa de Abandono)", PerspectiveType.CLIENTES, "OBJ-C2", "%", "(Clientes que cancelaron / Total clientes activos inicio) × 100", 8.5, 5.0, 7.2, KpiDirection.MENOR_MEJOR, "Mensual", "Carlos Ruiz", "Comercial", 1.0, "Churn 7.2% vs. 5% meta (KPI inverso – CRÍTICO). Crear equipo de Customer Success."},
                {"KPI-C07", "Nuevos Clientes Adquiridos", PerspectiveType.CLIENTES, "OBJ-C3", "#", "Conteo total de nuevas cuentas comerciales ganadas", 80.0, 120.0, 105.0, KpiDirection.MAYOR_MEJOR, "Mensual", "Carlos Ruiz", "Comercial", 1.0, "105 nuevos clientes vs. 120 meta (87.5%). Ampliar fuerza de ventas en regiones."},
                {"KPI-C08", "Cuota de Mercado", PerspectiveType.CLIENTES, "OBJ-C3", "%", "(Ventas de TechPeru SAC / Ventas Totales del Mercado) × 100", 6.0, 8.5, 7.8, KpiDirection.MAYOR_MEJOR, "Semestral", "Ana Pérez", "Gerencia General", 1.0, "Cuota al 91.8% de meta. Ejecutar campañas de awareness en mercados objetivo."},
                {"KPI-C09", "Costo por Lead Calificado", PerspectiveType.CLIENTES, "OBJ-C3", "S/", "Inversión en Marketing Digital / Total SQLs calificados", 240.0, 180.0, 215.0, KpiDirection.MENOR_MEJOR, "Mensual", "Carlos Ruiz", "Comercial", 1.0, "CAC por lead elevado. Migrar mayor presupuesto a canales orgánicos (SEO/contenido)."},

                // PROCESOS INTERNOS (9 KPIs)
                {"KPI-P01", "Tiempo Promedio de Entrega al Cliente", PerspectiveType.PROCESOS, "OBJ-P1", "días", "Días transcurridos desde recepción de orden hasta entrega efectiva", 4.5, 3.0, 3.5, KpiDirection.MENOR_MEJOR, "Mensual", "María Torres", "Operaciones", 1.0, "Entrega en 3.5 días vs. 3 días meta. Revisar cuellos de botella en picking y despacho."},
                {"KPI-P02", "Tasa de Defectos / Reclamos", PerspectiveType.PROCESOS, "OBJ-P1", "%", "(Órdenes con defectos o no conformidades / Total entregas) × 100", 3.8, 2.0, 2.8, KpiDirection.MENOR_MEJOR, "Mensual", "María Torres", "Operaciones", 1.0, "Defectos al 2.8% vs. 2% meta. Implementar control de calidad en cada etapa del proceso."},
                {"KPI-P03", "Productividad por Empleado", PerspectiveType.PROCESOS, "OBJ-P1", "S/ MM", "Facturación total de la empresa / Total de colaboradores activos", 0.22, 0.30, 0.264, KpiDirection.MAYOR_MEJOR, "Trimestral", "María Torres", "Operaciones", 1.0, "Productividad por debajo de meta. Automatizar tareas repetitivas con RPA."},
                {"KPI-P04", "N° Lanzamientos de Nuevos Productos", PerspectiveType.PROCESOS, "OBJ-P2", "#", "Conteo de nuevas soluciones tecnológicas introducidas al mercado", 2.0, 4.0, 3.0, KpiDirection.MAYOR_MEJOR, "Trimestral", "Carlos Ruiz", "I+D / Producto", 1.0, "Solo 3 de 4 productos lanzados. Acelerar MVP del 4° producto para Q4."},
                {"KPI-P05", "Time-to-Market (lanzamiento)", PerspectiveType.PROCESOS, "OBJ-P2", "semanas", "Semanas requeridas desde definición hasta disponibilidad comercial", 18.0, 12.0, 15.0, KpiDirection.MENOR_MEJOR, "Trimestral", "Carlos Ruiz", "I+D / Producto", 1.0, "Time-to-market 25% por encima de meta. Adoptar metodología ágil en equipos de producto."},
                {"KPI-P06", "% Ingresos de Productos < 2 años", PerspectiveType.PROCESOS, "OBJ-P2", "%", "(Ventas de productos con <24 meses / Ventas Totales) × 100", 14.0, 25.0, 18.0, KpiDirection.MAYOR_MEJOR, "Semestral", "Carlos Ruiz", "I+D / Producto", 1.0, "Ingresos de nuevos productos al 72% de meta. Fortalecer validación de mercado pre-lanzamiento."},
                {"KPI-P07", "On-Time Delivery de Proveedores (OTD)", PerspectiveType.PROCESOS, "OBJ-P3", "%", "(Órdenes de proveedores recibidas a tiempo / Total órdenes) × 100", 85.0, 95.0, 92.0, KpiDirection.MAYOR_MEJOR, "Mensual", "María Torres", "Operaciones", 1.0, "OTD al 96.8% de meta. Negociar SLAs más estrictos con los 3 proveedores críticos."},
                {"KPI-P08", "N° Incidencias con Proveedores", PerspectiveType.PROCESOS, "OBJ-P3", "#", "No conformidades técnicas o retrasos severos reportados en compras", 12.0, 5.0, 8.0, KpiDirection.MENOR_MEJOR, "Mensual", "María Torres", "Operaciones", 1.0, "8 incidencias vs. 5 meta. Implementar sistema de evaluación mensual de proveedores."},
                {"KPI-P09", "Costo de Inventario sobre Ventas", PerspectiveType.PROCESOS, "OBJ-P3", "%", "(Valor Promedio de Inventario / Ventas Anuales) × 100", 16.0, 12.0, 14.5, KpiDirection.MENOR_MEJOR, "Mensual", "María Torres", "Operaciones", 1.0, "Inventario al 20.8% sobre meta. Revisar política de stock mínimo y modelo de compras."},

                // APRENDIZAJE Y CRECIMIENTO (9 KPIs)
                {"KPI-A01", "Horas de Capacitación por Empleado", PerspectiveType.APRENDIZAJE, "OBJ-A1", "hrs", "Horas lectivas formales de formación / Total plantilla activa", 24.0, 40.0, 35.0, KpiDirection.MAYOR_MEJOR, "Trimestral", "Rosa Medina", "Talento Humano", 1.0, "35 hrs vs. 40 hrs meta (87.5%). Agregar 2 sesiones de capacitación virtual mensual."},
                {"KPI-A02", "% Empleados con Plan de Desarrollo", PerspectiveType.APRENDIZAJE, "OBJ-A1", "%", "(Colaboradores con PDI aprobado / Total plantilla activa) × 100", 55.0, 80.0, 72.0, KpiDirection.MAYOR_MEJOR, "Semestral", "Rosa Medina", "Talento Humano", 1.0, "72% vs. 80% meta. Hacer obligatoria la capacitación para todos los equipos de ventas."},
                {"KPI-A03", "Índice de Competencias Clave Cubiertas", PerspectiveType.APRENDIZAJE, "OBJ-A1", "%", "(Competencias evaluadas satisfactorias / Requeridas por perfil) × 100", 65.0, 85.0, 74.0, KpiDirection.MAYOR_MEJOR, "Semestral", "Rosa Medina", "Talento Humano", 1.0, "74% vs. 85% meta. Identificar brechas de competencias y crear plan de cierre por área."},
                {"KPI-A04", "Índice de Satisfacción del Empleado", PerspectiveType.APRENDIZAJE, "OBJ-A2", "%", "(Puntaje promedio encuesta de clima laboral / Puntaje máximo) × 100", 60.0, 75.0, 68.0, KpiDirection.MAYOR_MEJOR, "Semestral", "Rosa Medina", "Talento Humano", 1.0, "Satisfacción al 90.7% de meta. Lanzar encuesta trimestral y plan de acción en 30 días."},
                {"KPI-A05", "Rotación de Personal (Turnover)", PerspectiveType.APRENDIZAJE, "OBJ-A2", "%", "(Total renuncias y ceses del período / Dotación media) × 100", 14.0, 8.0, 10.0, KpiDirection.MENOR_MEJOR, "Mensual", "Rosa Medina", "Talento Humano", 1.0, "Rotación 10% vs. 8% meta (KPI inverso – CRÍTICO/EN RIESGO). Revisar esquema de compensación y línea de carrera."},
                {"KPI-A06", "% Empleados con Evaluación Desempeño", PerspectiveType.APRENDIZAJE, "OBJ-A2", "%", "(Colaboradores evaluados formalmente / Total evaluables) × 100", 75.0, 95.0, 88.0, KpiDirection.MAYOR_MEJOR, "Semestral", "Rosa Medina", "Talento Humano", 1.0, "88% vs. 95% meta. Completar evaluaciones de desempeño pendientes antes de fin de Q3."},
                {"KPI-A07", "Proyectos de Mejora Continua Activos", PerspectiveType.APRENDIZAJE, "OBJ-A3", "#", "Conteo de iniciativas Kaizen y optimización de procesos en ejecución", 3.0, 6.0, 5.0, KpiDirection.MAYOR_MEJOR, "Trimestral", "Ana Pérez", "Innovación", 1.0, "5 de 6 proyectos activos (83.3%). Conformar equipo de mejora continua multidisciplinario."},
                {"KPI-A08", "% Presupuesto I+D sobre Ingresos", PerspectiveType.APRENDIZAJE, "OBJ-A3", "%", "(Inversión ejecutada en I+D y software / Ingresos Totales) × 100", 2.5, 5.0, 3.8, KpiDirection.MAYOR_MEJOR, "Trimestral", "Luis Quispe", "Finanzas", 1.0, "Presupuesto I+D al 76% de meta. Presentar propuesta de incremento para próximo presupuesto."},
                {"KPI-A09", "Ideas Implementadas de Empleados", PerspectiveType.APRENDIZAJE, "OBJ-A3", "#", "Número de propuestas de innovación de colaboradores ejecutadas", 8.0, 24.0, 16.0, KpiDirection.MAYOR_MEJOR, "Mensual", "Rosa Medina", "Talento Humano", 1.0, "16 de 24 ideas implementadas (66.7%). Crear plataforma digital de gestión de ideas."}
        };

        String[] months = {"2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06"};
        String[] days = {"28", "27", "30", "29", "30", "30"};

        List<Kpi> kpis = new ArrayList<>();
        List<KpiMeasurement> measurementsToSave = new ArrayList<>();

        for (Object[] r : rawData) {
            String id = (String) r[0];
            String name = (String) r[1];
            PerspectiveType pType = (PerspectiveType) r[2];
            String objId = (String) r[3];
            String unit = (String) r[4];
            String formula = (String) r[5];
            Double baseline = (Double) r[6];
            Double target = (Double) r[7];
            Double current = (Double) r[8];
            KpiDirection direction = (KpiDirection) r[9];
            String freq = (String) r[10];
            String owner = (String) r[11];
            String area = (String) r[12];
            Double weight = (Double) r[13];
            String rec = (String) r[14];

            Kpi kpi = Kpi.builder()
                    .id(id)
                    .name(name)
                    .perspective(pType)
                    .objectiveId(objId)
                    .unit(unit)
                    .formula(formula)
                    .baseline(baseline)
                    .target(target)
                    .current(current)
                    .direction(direction)
                    .frequency(freq)
                    .owner(owner)
                    .area(area)
                    .weight(weight)
                    .recommendation(rec)
                    .description("Indicador estratégico oficial de TechPeru SAC 2025. " + rec)
                    .build();

            Double compliance = calculationEngine.calculateCompliance(kpi, current);
            kpi.setCompliance(compliance);
            kpi.setStatus(calculationEngine.determineStatus(compliance));

            // Generar mediciones mensuales
            for (int m = 0; m < months.length; m++) {
                String month = months[m];
                double factor = (double) (m + 1) / 6.0;
                double val;
                if (direction == KpiDirection.MENOR_MEJOR) {
                    val = baseline - (baseline - current) * factor + (m % 2 == 1 ? 0.1 : -0.1);
                } else {
                    val = baseline + (current - baseline) * factor + (m % 2 == 1 ? 0.2 : -0.2);
                }
                if (m == 5) val = current; // El mes 6 coincide con el Real Acumulado oficial

                val = Math.round(val * 100.0) / 100.0;

                KpiMeasurement km = KpiMeasurement.builder()
                        .id(String.format("M-%s-%s", id, month))
                        .kpiId(id)
                        .period(month)
                        .date(String.format("%s-%s", month, days[m]))
                        .value(val)
                        .notes(m == 5 ? "Cierre acumulado oficial según Cuadro de Mando 2025" : "Registro mensual consolidado")
                        .responsible(owner)
                        .build();

                measurementsToSave.add(km);
            }

            kpis.add(kpi);
        }

        kpiRepository.saveAll(kpis);
        measurementRepository.saveAll(measurementsToSave);
    }

    private void seedInitiatives() {
        List<StrategicInitiative> inits = List.of(
                StrategicInitiative.builder().id("INI-01").name("Mesa de Ayuda Nivel 2 y Atención Omnicanal").objectiveId("OBJ-C1").kpiId("KPI-C03").owner("María Torres").area("Operaciones").startDate("2025-01-15").endDate("2025-08-30").budget(45000.0).progress(65.0).status("En ejecución").description("Crear un equipo especializado de soporte nivel 2 y flujo omnicanal para reducir el tiempo de resolución de quejas a menos de 2 días.").build(),
                StrategicInitiative.builder().id("INI-02").name("Programa Customer Success y Retención B2B").objectiveId("OBJ-C2").kpiId("KPI-C06").owner("Carlos Ruiz").area("Comercial").startDate("2025-02-01").endDate("2025-10-31").budget(60000.0).progress(40.0).status("En riesgo").description("Implementar protocolo proactivo de contacto y planes de fidelización con descuentos por volumen para frenar el churn de 7.2% a <5%.").build(),
                StrategicInitiative.builder().id("INI-03").name("Sistema de Control de Calidad Integral Six Sigma").objectiveId("OBJ-P1").kpiId("KPI-P02").owner("María Torres").area("Operaciones").startDate("2025-01-01").endDate("2025-09-30").budget(55000.0).progress(50.0).status("En ejecución").description("Estandarización de control de calidad por etapas y rediseño de picking y despacho para bajar la tasa de defectos de 2.8% a <2%.").build(),
                StrategicInitiative.builder().id("INI-04").name("Aceleradora Ágil para Lanzamiento de Nuevos Productos").objectiveId("OBJ-P2").kpiId("KPI-P06").owner("Carlos Ruiz").area("I+D / Producto").startDate("2025-03-01").endDate("2025-11-30").budget(75000.0).progress(35.0).status("En riesgo").description("Adoptar marcos Scrum en desarrollo para acelerar el MVP del 4° producto y aumentar ingresos de productos jóvenes al 25%.").build(),
                StrategicInitiative.builder().id("INI-05").name("Portal B2B y Homologación Mensual de Proveedores").objectiveId("OBJ-P3").kpiId("KPI-P08").owner("María Torres").area("Operaciones").startDate("2025-01-10").endDate("2025-07-31").budget(38000.0).progress(80.0).status("En ejecución").description("Plataforma digital para evaluación y scoring mensual de proveedores clave con el objetivo de reducir incidencias de 8 a 5.").build(),
                StrategicInitiative.builder().id("INI-06").name("Plataforma Digital 'TechInnova' para Ideas del Personal").objectiveId("OBJ-A3").kpiId("KPI-A09").owner("Rosa Medina").area("Talento Humano").startDate("2025-02-15").endDate("2025-10-15").budget(30000.0).progress(45.0).status("En ejecución").description("Buzón digital colaborativo con gamificación y reconocimientos para canalizar y poner en producción las 24 ideas meta.").build(),
                StrategicInitiative.builder().id("INI-07").name("Estrategia Digital de Adquisición Orgánica (SEO y CAC)").objectiveId("OBJ-F3").kpiId("KPI-F08").owner("Carlos Ruiz").area("Comercial").startDate("2025-01-01").endDate("2025-08-31").budget(42000.0).progress(70.0).status("En ejecución").description("Migración de inversión a canales de atracción orgánica y marketing de contenidos para disminuir el CAC de S/412 a S/350.").build(),
                StrategicInitiative.builder().id("INI-08").name("Programa de Retención de Talento Clave y Plan de Carrera").objectiveId("OBJ-A2").kpiId("KPI-A05").owner("Rosa Medina").area("Talento Humano").startDate("2025-01-01").endDate("2025-06-30").budget(35000.0).progress(90.0).status("En ejecución").description("Revisión salarial de mercado, incentivos por desempeño y capacitación para contener la rotación del 10% al 8%.").build()
        );
        initiativeRepository.saveAll(inits);
    }

    private void seedAudit() {
        AuditLog audit = AuditLog.builder()
                .id("AUD-001")
                .date(LocalDateTime.now())
                .user("Sistema")
                .action("Inicialización")
                .entity("TechPeru SAC 2025")
                .detail("Carga exitosa del Balanced Scorecard Ampliado (4 Perspectivas, 12 Objetivos, 36 KPIs, 8 Iniciativas).")
                .build();
        auditLogRepository.save(audit);
    }
}
