(() => {
  "use strict";

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  // Clave de almacenamiento en localStorage específica para TechPeru SAC 2025
  const STORAGE_KEY = "bsc_techperu_2025_v3";

  // Definición de las 4 Perspectivas Oficiales del BSC
  const perspectives = {
    financiera: { label: "Financiera", color: "#1d4ed8", soft: "#eff6ff", icon: "💰", code: "FIN" },
    clientes: { label: "Clientes", color: "#0d9488", soft: "#f0fdfa", icon: "👥", code: "CLI" },
    procesos: { label: "Procesos internos", color: "#d97706", soft: "#fffbeb", icon: "🔧", code: "PRO" },
    aprendizaje: { label: "Aprendizaje y crecimiento", color: "#7c3aed", soft: "#f5f3ff", icon: "📚", code: "APR" }
  };

  // Usuarios de Demostración con Roles
  const users = [
    { id: "u1", name: "Ana Pérez", email: "admin@demo.com", role: "Administrador", area: "Gerencia General", password: "BSC2026!" },
    { id: "u2", name: "Carlos Ruiz", email: "gerente@demo.com", role: "Gerente", area: "Gerencia Comercial", password: "BSC2026!" },
    { id: "u3", name: "María Torres", email: "responsable@demo.com", role: "Responsable de indicadores", area: "Operaciones", password: "BSC2026!" },
    { id: "u4", name: "Luis Quispe", email: "luis.quispe@demo.com", role: "Responsable de indicadores", area: "Finanzas", password: "BSC2026!" },
    { id: "u5", name: "Rosa Medina", email: "rosa.medina@demo.com", role: "Gerente", area: "Talento Humano", password: "BSC2026!" }
  ];

  // Estado inicial de demostración adaptado al Excel TechPeru SAC 2025
  const demoState = () => {
    // 12 Objetivos Estratégicos (3 por perspectiva)
    const objectives = [
      // Perspectiva Financiera
      { id: "OBJ-F1", name: "Incrementar la Rentabilidad", perspective: "financiera", description: "Maximizar el retorno del patrimonio y la utilidad neta mejorando márgenes operativos.", owner: "Ana Pérez", priority: "Alta", weight: 35, status: "Activo", created: "2025-01-05" },
      { id: "OBJ-F2", name: "Acelerar el Crecimiento de Ingresos", perspective: "financiera", description: "Elevar la facturación anual acelerando el pipeline comercial y lanzando nuevas soluciones.", owner: "Carlos Ruiz", priority: "Alta", weight: 35, status: "Activo", created: "2025-01-05" },
      { id: "OBJ-F3", name: "Optimizar la Estructura de Costos", perspective: "financiera", description: "Reducir ratio operativo, controlar el CAC y aumentar la productividad de los activos.", owner: "Luis Quispe", priority: "Media", weight: 30, status: "Activo", created: "2025-01-05" },

      // Perspectiva Clientes
      { id: "OBJ-C1", name: "Maximizar la Satisfacción del Cliente", perspective: "clientes", description: "Alcanzar altos índices de NPS y satisfacción post-venta con resolución inmediata de quejas.", owner: "Carlos Ruiz", priority: "Alta", weight: 35, status: "Activo", created: "2025-01-05" },
      { id: "OBJ-C2", name: "Aumentar la Retención y Fidelización", perspective: "clientes", description: "Retener la cartera corporativa, elevar la recompra recurrente y mitigar la tasa de abandono.", owner: "Carlos Ruiz", priority: "Alta", weight: 35, status: "Activo", created: "2025-01-05" },
      { id: "OBJ-C3", name: "Expandir la Base de Clientes", perspective: "clientes", description: "Conquistar nuevos clientes B2B, ampliar la cuota de mercado y optimizar el costo por lead.", owner: "Ana Pérez", priority: "Media", weight: 30, status: "Activo", created: "2025-01-05" },

      // Perspectiva Procesos Internos
      { id: "OBJ-P1", name: "Excelencia en Operaciones y Calidad", perspective: "procesos", description: "Cumplir entregas oportunas, minimizar defectos y quejas, y elevar la productividad por empleado.", owner: "María Torres", priority: "Alta", weight: 35, status: "Activo", created: "2025-01-05" },
      { id: "OBJ-P2", name: "Innovación y Desarrollo de Producto", perspective: "procesos", description: "Acelerar el time-to-market y asegurar que los nuevos lanzamientos representen mayores ventas.", owner: "Carlos Ruiz", priority: "Alta", weight: 35, status: "Activo", created: "2025-01-05" },
      { id: "OBJ-P3", name: "Gestión Eficiente de Proveedores", perspective: "procesos", description: "Garantizar cumplimiento de proveedores (OTD), reducir no conformidades y optimizar stock.", owner: "María Torres", priority: "Media", weight: 30, status: "Activo", created: "2025-01-05" },

      // Perspectiva Aprendizaje y Crecimiento
      { id: "OBJ-A1", name: "Desarrollar el Capital Humano", perspective: "aprendizaje", description: "Fortalecer competencias clave y asegurar cobertura de planes de desarrollo individual.", owner: "Rosa Medina", priority: "Alta", weight: 35, status: "Activo", created: "2025-01-05" },
      { id: "OBJ-A2", name: "Fortalecer la Cultura y el Clima", perspective: "aprendizaje", description: "Mejorar la satisfacción laboral, completar evaluaciones y contener la rotación de talento.", owner: "Rosa Medina", priority: "Alta", weight: 35, status: "Activo", created: "2025-01-05" },
      { id: "OBJ-A3", name: "Impulsar la Innovación Organizacional", perspective: "aprendizaje", description: "Fomentar proyectos Kaizen, invertir en I+D y canalizar ideas aplicadas de colaboradores.", owner: "Rosa Medina", priority: "Media", weight: 30, status: "Activo", created: "2025-01-05" }
    ];

    // 36 Indicadores KPI (Exactos del Excel TechPeru SAC 2025)
    // Formato: [ID, Nombre, Perspectiva, ObjetivoId, Unidad, Fórmula, Baseline, Meta, RealAcum, Dirección, Frecuencia, Responsable, Área, Peso, Acción/Recomendación]
    const kpisRaw = [
      // 💰 FINANCIERA (9 KPIs)
      ["KPI-F01", "ROE – Retorno sobre Patrimonio", "financiera", "OBJ-F1", "%", "(Utilidad Neta / Patrimonio Neto) × 100", 15.0, 18.0, 16.5, "mayor", "Trimestral", "Ana Pérez", "Finanzas", 1, "ROE por debajo del 18% meta. Revisar estructura de capital y palanca financiera."],
      ["KPI-F02", "Margen EBITDA", "financiera", "OBJ-F1", "%", "(EBITDA / Ventas Totales) × 100", 18.0, 22.0, 19.8, "mayor", "Mensual", "Luis Quispe", "Finanzas", 1, "Margen comprimido por costos operativos. Plan de reducción de gastos en Q3-Q4."],
      ["KPI-F03", "Utilidad Neta Anual", "financiera", "OBJ-F1", "S/ MM", "Ingresos Totales - Costos y Gastos - Impuestos", 1.6, 2.1, 1.869, "mayor", "Mensual", "Luis Quispe", "Finanzas", 1, "Utilidad neta al 89% de la meta. Requiere incremento de márgenes o volumen."],
      ["KPI-F04", "Crecimiento de Ventas YoY", "financiera", "OBJ-F2", "%", "((Ventas Actuales - Ventas Año Previo) / Ventas Año Previo) × 100", 10.0, 15.0, 12.3, "mayor", "Trimestral", "Carlos Ruiz", "Comercial", 1, "Crecimiento al 82% de la meta. Acelerar pipeline comercial y campañas de upsell."],
      ["KPI-F05", "Ingresos Totales Anuales", "financiera", "OBJ-F2", "S/ MM", "Facturación neta acumulada en el año", 7.0, 8.5, 7.9, "mayor", "Mensual", "Carlos Ruiz", "Comercial", 1, "Ingresos 7.2% por debajo de meta. Revisar estrategia de precios y mix de productos."],
      ["KPI-F06", "Ingresos por Nuevos Productos", "financiera", "OBJ-F2", "%", "(Facturación Productos Nuevos / Facturación Total) × 100", 12.0, 20.0, 15.6, "mayor", "Trimestral", "Carlos Ruiz", "Comercial", 1, "Nuevos productos aportan 15.6% vs. 20% meta. Acelerar lanzamiento de Pipeline Q3."],
      ["KPI-F07", "Ratio Costo Operativo / Ingreso", "financiera", "OBJ-F3", "%", "(Gastos Operativos / Ingresos Operacionales) × 100", 62.0, 55.0, 58.2, "menor", "Mensual", "Luis Quispe", "Finanzas", 1, "Ratio de costo elevado (58.2% vs 55% meta). Automatizar procesos para reducir costos."],
      ["KPI-F08", "Costo de Adquisición de Cliente (CAC)", "financiera", "OBJ-F3", "S/", "(Gastos Marketing + Ventas) / Nuevos Clientes Captados", 450.0, 350.0, 412.0, "menor", "Mensual", "Carlos Ruiz", "Comercial", 1, "CAC de S/412 vs S/350 meta. Optimizar canales de adquisición digital."],
      ["KPI-F09", "Retorno sobre Activos (ROA)", "financiera", "OBJ-F3", "%", "(Utilidad Neta / Activos Totales Promedio) × 100", 6.5, 9.0, 7.8, "mayor", "Trimestral", "Luis Quispe", "Finanzas", 1, "ROA bajo meta. Revisar eficiencia de activos y desinversión de activos ociosos."],

      // 👥 CLIENTES (9 KPIs)
      ["KPI-C01", "NPS – Net Promoter Score", "clientes", "OBJ-C1", "pts", "% Clientes Promotores - % Clientes Detractores", 50.0, 65.0, 58.0, "mayor", "Trimestral", "Carlos Ruiz", "Servicio al Cliente", 1, "NPS de 58 (meta 65). Implementar programa de seguimiento post-venta en 30/60/90 días."],
      ["KPI-C02", "CSAT – Satisfacción post-venta", "clientes", "OBJ-C1", "%", "(Calificaciones 4 y 5 / Total encuestados) × 100", 78.0, 88.0, 84.0, "mayor", "Mensual", "Carlos Ruiz", "Servicio al Cliente", 1, "CSAT al 95.5% de meta. Reforzar proceso de onboarding y soporte técnico."],
      ["KPI-C03", "Tiempo de Resolución de Quejas", "clientes", "OBJ-C1", "días", "Suma de días para resolver quejas / Total quejas cerradas", 4.5, 2.0, 2.8, "menor", "Mensual", "María Torres", "Operaciones", 1, "Tiempo de resolución 2.8 días vs. 2 días meta. Crear equipo dedicado de soporte nivel 2."],
      ["KPI-C04", "Tasa de Retención de Clientes", "clientes", "OBJ-C2", "%", "((Clientes Finales - Nuevos Clientes) / Clientes Iniciales) × 100", 80.0, 90.0, 87.0, "mayor", "Trimestral", "Carlos Ruiz", "Comercial", 1, "Retención al 96.7% de meta. Lanzar programa de fidelización con descuentos por volumen."],
      ["KPI-C05", "Tasa de Recompra (Repeat Purchase)", "clientes", "OBJ-C2", "%", "(Clientes con >1 compra en el período / Clientes Activos) × 100", 40.0, 55.0, 49.0, "mayor", "Mensual", "Carlos Ruiz", "Comercial", 1, "Recompra al 89% de meta. Implementar campañas de re-engagement a los 90 días."],
      ["KPI-C06", "Churn Rate (Tasa de Abandono)", "clientes", "OBJ-C2", "%", "(Clientes que cancelaron / Total clientes activos inicio) × 100", 8.5, 5.0, 7.2, "menor", "Mensual", "Carlos Ruiz", "Comercial", 1, "Churn 7.2% vs. 5% meta (KPI inverso – CRÍTICO). Crear equipo de Customer Success."],
      ["KPI-C07", "Nuevos Clientes Adquiridos", "clientes", "OBJ-C3", "#", "Conteo total de nuevas cuentas comerciales ganadas", 80.0, 120.0, 105.0, "mayor", "Mensual", "Carlos Ruiz", "Comercial", 1, "105 nuevos clientes vs. 120 meta (87.5%). Ampliar fuerza de ventas en regiones."],
      ["KPI-C08", "Cuota de Mercado", "clientes", "OBJ-C3", "%", "(Ventas de TechPeru SAC / Ventas Totales del Mercado) × 100", 6.0, 8.5, 7.8, "mayor", "Semestral", "Ana Pérez", "Gerencia General", 1, "Cuota al 91.8% de meta. Ejecutar campañas de awareness en mercados objetivo."],
      ["KPI-C09", "Costo por Lead Calificado", "clientes", "OBJ-C3", "S/", "Inversión en Marketing Digital / Total SQLs calificados", 240.0, 180.0, 215.0, "menor", "Mensual", "Carlos Ruiz", "Comercial", 1, "CAC por lead elevado. Migrar mayor presupuesto a canales orgánicos (SEO/contenido)."],

      // 🔧 PROCESOS INTERNOS (9 KPIs)
      ["KPI-P01", "Tiempo Promedio de Entrega al Cliente", "procesos", "OBJ-P1", "días", "Días transcurridos desde recepción de orden hasta entrega efectiva", 4.5, 3.0, 3.5, "menor", "Mensual", "María Torres", "Operaciones", 1, "Entrega en 3.5 días vs. 3 días meta. Revisar cuellos de botella en picking y despacho."],
      ["KPI-P02", "Tasa de Defectos / Reclamos", "procesos", "OBJ-P1", "%", "(Órdenes con defectos o no conformidades / Total entregas) × 100", 3.8, 2.0, 2.8, "menor", "Mensual", "María Torres", "Operaciones", 1, "Defectos al 2.8% vs. 2% meta. Implementar control de calidad en cada etapa del proceso."],
      ["KPI-P03", "Productividad por Empleado", "procesos", "OBJ-P1", "S/ MM", "Facturación total de la empresa / Total de colaboradores activos", 0.22, 0.30, 0.264, "mayor", "Trimestral", "María Torres", "Operaciones", 1, "Productividad por debajo de meta. Automatizar tareas repetitivas con RPA."],
      ["KPI-P04", "N° Lanzamientos de Nuevos Productos", "procesos", "OBJ-P2", "#", "Conteo de nuevas soluciones tecnológicas introducidas al mercado", 2.0, 4.0, 3.0, "mayor", "Trimestral", "Carlos Ruiz", "I+D / Producto", 1, "Solo 3 de 4 productos lanzados. Acelerar MVP del 4° producto para Q4."],
      ["KPI-P05", "Time-to-Market (lanzamiento)", "procesos", "OBJ-P2", "semanas", "Semanas requeridas desde definición hasta disponibilidad comercial", 18.0, 12.0, 15.0, "menor", "Trimestral", "Carlos Ruiz", "I+D / Producto", 1, "Time-to-market 25% por encima de meta. Adoptar metodología ágil en equipos de producto."],
      ["KPI-P06", "% Ingresos de Productos < 2 años", "procesos", "OBJ-P2", "%", "(Ventas de productos con <24 meses / Ventas Totales) × 100", 14.0, 25.0, 18.0, "mayor", "Semestral", "Carlos Ruiz", "I+D / Producto", 1, "Ingresos de nuevos productos al 72% de meta. Fortalecer validación de mercado pre-lanzamiento."],
      ["KPI-P07", "On-Time Delivery de Proveedores (OTD)", "procesos", "OBJ-P3", "%", "(Órdenes de proveedores recibidas a tiempo / Total órdenes) × 100", 85.0, 95.0, 92.0, "mayor", "Mensual", "María Torres", "Operaciones", 1, "OTD al 96.8% de meta. Negociar SLAs más estrictos con los 3 proveedores críticos."],
      ["KPI-P08", "N° Incidencias con Proveedores", "procesos", "OBJ-P3", "#", "No conformidades técnicas o retrasos severos reportados en compras", 12.0, 5.0, 8.0, "menor", "Mensual", "María Torres", "Operaciones", 1, "8 incidencias vs. 5 meta. Implementar sistema de evaluación mensual de proveedores."],
      ["KPI-P09", "Costo de Inventario sobre Ventas", "procesos", "OBJ-P3", "%", "(Valor Promedio de Inventario / Ventas Anuales) × 100", 16.0, 12.0, 14.5, "menor", "Mensual", "María Torres", "Operaciones", 1, "Inventario al 20.8% sobre meta. Revisar política de stock mínimo y modelo de compras."],

      // 📚 APRENDIZAJE Y CRECIMIENTO (9 KPIs)
      ["KPI-A01", "Horas de Capacitación por Empleado", "aprendizaje", "OBJ-A1", "hrs", "Horas lectivas formales de formación / Total plantilla activa", 24.0, 40.0, 35.0, "mayor", "Trimestral", "Rosa Medina", "Talento Humano", 1, "35 hrs vs. 40 hrs meta (87.5%). Agregar 2 sesiones de capacitación virtual mensual."],
      ["KPI-A02", "% Empleados con Plan de Desarrollo", "aprendizaje", "OBJ-A1", "%", "(Colaboradores con PDI aprobado / Total plantilla activa) × 100", 55.0, 80.0, 72.0, "mayor", "Semestral", "Rosa Medina", "Talento Humano", 1, "72% vs. 80% meta. Hacer obligatoria la capacitación para todos los equipos de ventas."],
      ["KPI-A03", "Índice de Competencias Clave Cubiertas", "aprendizaje", "OBJ-A1", "%", "(Competencias evaluadas satisfactorias / Requeridas por perfil) × 100", 65.0, 85.0, 74.0, "mayor", "Semestral", "Rosa Medina", "Talento Humano", 1, "74% vs. 85% meta. Identificar brechas de competencias y crear plan de cierre por área."],
      ["KPI-A04", "Índice de Satisfacción del Empleado", "aprendizaje", "OBJ-A2", "%", "(Puntaje promedio encuesta de clima laboral / Puntaje máximo) × 100", 60.0, 75.0, 68.0, "mayor", "Semestral", "Rosa Medina", "Talento Humano", 1, "Satisfacción al 90.7% de meta. Lanzar encuesta trimestral y plan de acción en 30 días."],
      ["KPI-A05", "Rotación de Personal (Turnover)", "aprendizaje", "OBJ-A2", "%", "(Total renuncias y ceses del período / Dotación media) × 100", 14.0, 8.0, 10.0, "menor", "Mensual", "Rosa Medina", "Talento Humano", 1, "Rotación 10% vs. 8% meta (KPI inverso – CRÍTICO/EN RIESGO). Revisar esquema de compensación y línea de carrera."],
      ["KPI-A06", "% Empleados con Evaluación Desempeño", "aprendizaje", "OBJ-A2", "%", "(Colaboradores evaluados formalmente / Total evaluables) × 100", 75.0, 95.0, 88.0, "mayor", "Semestral", "Rosa Medina", "Talento Humano", 1, "88% vs. 95% meta. Completar evaluaciones de desempeño pendientes antes de fin de Q3."],
      ["KPI-A07", "Proyectos de Mejora Continua Activos", "aprendizaje", "OBJ-A3", "#", "Conteo de iniciativas Kaizen y optimización de procesos en ejecución", 3.0, 6.0, 5.0, "mayor", "Trimestral", "Ana Pérez", "Innovación", 1, "5 de 6 proyectos activos (83.3%). Conformar equipo de mejora continua multidisciplinario."],
      ["KPI-A08", "% Presupuesto I+D sobre Ingresos", "aprendizaje", "OBJ-A3", "%", "(Inversión ejecutada en I+D y software / Ingresos Totales) × 100", 2.5, 5.0, 3.8, "mayor", "Trimestral", "Luis Quispe", "Finanzas", 1, "Presupuesto I+D al 76% de meta. Presentar propuesta de incremento para próximo presupuesto."],
      ["KPI-A09", "Ideas Implementadas de Empleados", "aprendizaje", "OBJ-A3", "#", "Número de propuestas de innovación de colaboradores ejecutadas", 8.0, 24.0, 16.0, "mayor", "Mensual", "Rosa Medina", "Talento Humano", 1, "16 de 24 ideas implementadas (66.7%). Crear plataforma digital de gestión de ideas."]
    ];

    const kpis = kpisRaw.map(a => ({
      id: a[0],
      name: a[1],
      perspective: a[2],
      objectiveId: a[3],
      unit: a[4],
      formula: a[5],
      baseline: a[6],
      target: a[7],
      current: a[8],
      direction: a[9],
      frequency: a[10],
      owner: a[11],
      area: a[12],
      weight: a[13],
      recommendation: a[14],
      description: `Indicador estratégico oficial de TechPeru SAC correspondiente al período 2025. ${a[14]}`,
      lower: null,
      upper: null,
      alertAt: 75,     // Umbral de alerta (Ámbar) establecido en el Excel
      criticalAt: 75,  // Por debajo de 75% es Crítico (Rojo)
      targetAt: 90,    // A partir de 90% es Logrado (Verde)
      measurements: []
    }));

    // Generar mediciones históricas mensuales para 2025 (Ene - Jun)
    const months = ["2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06"];
    kpis.forEach(k => {
      if (k.current === null) return;
      months.forEach((month, m) => {
        const factor = (m + 1) / 6;
        let v;
        if (k.direction === "menor") {
          v = Number((k.baseline - (k.baseline - k.current) * factor + (m % 2 ? 0.1 : -0.1)).toFixed(2));
        } else {
          v = Number((k.baseline + (k.current - k.baseline) * factor + (m % 2 ? 0.2 : -0.2)).toFixed(2));
        }
        if (m === 5) v = k.current; // El último mes coincide exactamente con el Real Acumulado del Excel
        k.measurements.push({
          id: `M-${k.id}-${month}`,
          period: month,
          date: `${month}-${["28", "27", "30", "29", "30", "30"][m]}`,
          value: v,
          notes: m === 5 ? "Cierre acumulado oficial según Cuadro de Mando 2025" : "Registro mensual consolidado",
          responsible: k.owner
        });
      });
    });

    // 8 Iniciativas Estratégicas vinculadas directamente a los KPIs en riesgo o críticos
    const initiatives = [
      {
        id: "INI-01",
        name: "Mesa de Ayuda Nivel 2 y Atención Omnicanal",
        objectiveId: "OBJ-C1",
        kpiId: "KPI-C03",
        owner: "María Torres",
        area: "Operaciones",
        start: "2025-01-15",
        end: "2025-08-30",
        budget: 45000,
        progress: 65,
        status: "En ejecución",
        description: "Crear un equipo especializado de soporte nivel 2 y flujo omnicanal para reducir el tiempo de resolución de quejas a menos de 2 días."
      },
      {
        id: "INI-02",
        name: "Programa Customer Success y Retención B2B",
        objectiveId: "OBJ-C2",
        kpiId: "KPI-C06",
        owner: "Carlos Ruiz",
        area: "Comercial",
        start: "2025-02-01",
        end: "2025-10-31",
        budget: 60000,
        progress: 40,
        status: "En riesgo",
        description: "Implementar protocolo proactivo de contacto y planes de fidelización con descuentos por volumen para frenar el churn de 7.2% a <5%."
      },
      {
        id: "INI-03",
        name: "Sistema de Control de Calidad Integral Six Sigma",
        objectiveId: "OBJ-P1",
        kpiId: "KPI-P02",
        owner: "María Torres",
        area: "Operaciones",
        start: "2025-01-01",
        end: "2025-09-30",
        budget: 55000,
        progress: 50,
        status: "En ejecución",
        description: "Estandarización de control de calidad por etapas y rediseño de picking y despacho para bajar la tasa de defectos de 2.8% a <2%."
      },
      {
        id: "INI-04",
        name: "Aceleradora Ágil para Lanzamiento de Nuevos Productos",
        objectiveId: "OBJ-P2",
        kpiId: "KPI-P06",
        owner: "Carlos Ruiz",
        area: "I+D / Producto",
        start: "2025-03-01",
        end: "2025-11-30",
        budget: 75000,
        progress: 35,
        status: "En riesgo",
        description: "Adoptar marcos Scrum en desarrollo para acelerar el MVP del 4° producto y aumentar ingresos de productos jóvenes al 25%."
      },
      {
        id: "INI-05",
        name: "Portal B2B y Homologación Mensual de Proveedores",
        objectiveId: "OBJ-P3",
        kpiId: "KPI-P08",
        owner: "María Torres",
        area: "Operaciones",
        start: "2025-01-10",
        end: "2025-07-31",
        budget: 38000,
        progress: 80,
        status: "En ejecución",
        description: "Plataforma digital para evaluación y scoring mensual de proveedores clave con el objetivo de reducir incidencias de 8 a 5."
      },
      {
        id: "INI-06",
        name: "Plataforma Digital 'TechInnova' para Ideas del Personal",
        objectiveId: "OBJ-A3",
        kpiId: "KPI-A09",
        owner: "Rosa Medina",
        area: "Talento Humano",
        start: "2025-02-15",
        end: "2025-10-15",
        budget: 30000,
        progress: 45,
        status: "En ejecución",
        description: "Buzón digital colaborativo con gamificación y reconocimientos para canalizar y poner en producción las 24 ideas meta."
      },
      {
        id: "INI-07",
        name: "Estrategia Digital de Adquisición Orgánica (SEO y CAC)",
        objectiveId: "OBJ-F3",
        kpiId: "KPI-F08",
        owner: "Carlos Ruiz",
        area: "Comercial",
        start: "2025-01-01",
        end: "2025-08-31",
        budget: 42000,
        progress: 70,
        status: "En ejecución",
        description: "Migración de inversión a canales de atracción orgánica y marketing de contenidos para disminuir el CAC de S/412 a S/350."
      },
      {
        id: "INI-08",
        name: "Programa de Retención de Talento Clave y Plan de Carrera",
        objectiveId: "OBJ-A2",
        kpiId: "KPI-A05",
        owner: "Rosa Medina",
        area: "Talento Humano",
        start: "2025-01-01",
        end: "2025-06-30",
        budget: 35000,
        progress: 90,
        status: "En ejecución",
        description: "Revisión salarial de mercado, incentivos por desempeño y capacitación para contener la rotación del 10% al 8%."
      }
    ];

    return {
      company: "TechPeru SAC",
      period: "2025",
      objectives,
      kpis,
      initiatives,
      users: users.map(({ password, ...u }) => u),
      audit: [
        { id: "AUD-001", date: new Date().toISOString(), user: "Sistema", action: "Inicialización", entity: "TechPeru SAC 2025", detail: "Carga del Balanced Scorecard Ampliado (4 Perspectivas, 12 Objetivos, 36 KPIs)." }
      ]
    };
  };

  let state;
  let currentUser = null;
  let currentPage = "dashboard";
  let charts = {};
  let modalSubmit = null;

  // Cargar estado de localStorage o inicializar demo
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.kpis && parsed.kpis.length === 36 && parsed.objectives && parsed.objectives.length === 12) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("No se pudo leer el estado local previo", e);
    }
    return demoState();
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      toast("No se pudo guardar en el navegador. Exporta los datos como respaldo.", "error");
    }
  }

  function escapeHtml(s) {
    return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function fmt(n, d = 1) {
    if (n === null || n === undefined || n === "") return "—";
    return Number(n).toLocaleString("es-PE", { maximumFractionDigits: d, minimumFractionDigits: d > 0 ? 1 : 0 });
  }

  function currency(n) {
    return "S/ " + Number(n || 0).toLocaleString("es-PE", { maximumFractionDigits: 0 });
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function monthNow() {
    return "2025-06"; // Periodo de evaluación activo de la demostración
  }

  // -------------------------------------------------------------
  // LÓGICA DE NEGOCIO: CÁLCULO DE CUMPLIMIENTO Y SEMÁFORO
  // -------------------------------------------------------------
  // Regla del Excel TechPeru SAC 2025:
  // - Mayor es mejor: Real / Meta * 100
  // - Menor es mejor: Meta / Real * 100
  // - Verde (Logrado): >= 90%
  // - Ámbar (En riesgo): 75% a 89.9%
  // - Rojo (Crítico): < 75%
  function achievement(k, value = k.current) {
    if (value === null || value === undefined || value === "" || k.target === null || k.target === undefined) return null;
    value = Number(value);
    const target = Number(k.target);

    if (k.direction === "rango") {
      if (value >= Number(k.lower) && value <= Number(k.upper)) return 100;
      const distance = value < Number(k.lower) ? Number(k.lower) - value : value - Number(k.upper);
      const span = Math.max(1, Math.abs(Number(k.upper) - Number(k.lower)));
      return Math.max(0, 100 - (distance / span * 100));
    }

    if (k.direction === "menor") {
      if (value <= 0 && target <= 0) return 100;
      if (value <= 0) return 100;
      // Fórmula de KPI inverso del Excel: Meta / Real * 100
      return (target / value) * 100;
    }

    // Dirección mayor es mejor: Real / Meta * 100
    if (target === 0) return value >= 0 ? 100 : 0;
    return (value / target) * 100;
  }

  function statusOf(k, value = k.current) {
    if (value === null || value === undefined || value === "") {
      return { key: "neutral", label: "Sin datos", pct: null, badge: "⚪ Sin datos" };
    }
    const pct = achievement(k, Number(value));
    if (pct === null) {
      return { key: "neutral", label: "Sin datos", pct: null, badge: "⚪ Sin datos" };
    }
    // Criterios de semáforo del Excel TechPeru SAC 2025
    if (pct >= 90) {
      return { key: "good", label: "Logrado", pct, badge: "✅ LOGRADO" };
    }
    if (pct >= 75) {
      return { key: "warn", label: "En riesgo", pct, badge: "⚠ EN RIESGO" };
    }
    return { key: "bad", label: "Crítico", pct, badge: "❌ CRÍTICO" };
  }

  function statusBadge(k, value = k.current) {
    const s = statusOf(k, value);
    return `<span class="status ${s.key}" title="${s.pct !== null ? fmt(s.pct) + '% de cumplimiento' : 'Sin datos'}">${s.badge}</span>`;
  }

  // Cumplimiento global del BSC: promedio de los 36 KPIs (84.2% inicial)
  function globalCompliance() {
    const valid = state.kpis.map(k => achievement(k)).filter(p => p !== null);
    if (!valid.length) return null;
    return valid.reduce((acc, v) => acc + v, 0) / valid.length;
  }

  // Desempeño promedio agrupado por cada perspectiva
  function perspectiveBreakdown() {
    return Object.entries(perspectives).map(([key, p]) => {
      const ks = state.kpis.filter(k => k.perspective === key);
      const valid = ks.map(k => achievement(k)).filter(pct => pct !== null);
      const pct = valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : null;
      return {
        key,
        ...p,
        pct,
        kpiCount: ks.length,
        goodCount: ks.filter(k => statusOf(k).key === "good").length,
        warnCount: ks.filter(k => statusOf(k).key === "warn").length,
        badCount: ks.filter(k => statusOf(k).key === "bad").length
      };
    });
  }

  function perspectiveLabel(p) {
    return perspectives[p]?.label || p || "—";
  }

  function perspectiveIcon(p) {
    return perspectives[p]?.icon || "◎";
  }

  function objectiveName(id) {
    return state.objectives.find(o => o.id === id)?.name || "Objetivo no asignado";
  }

  function kpiName(id) {
    return state.kpis.find(k => k.id === id)?.name || "Sin KPI asociado";
  }

  function canEdit() {
    return currentUser && ["Administrador", "Gerente"].includes(currentUser.role);
  }

  function canAdmin() {
    return currentUser?.role === "Administrador";
  }

  function recordAudit(action, entity, detail) {
    state.audit.unshift({
      id: "AUD-" + String(Date.now()).slice(-6),
      date: new Date().toISOString(),
      user: currentUser?.name || "Sistema",
      action,
      entity,
      detail
    });
    state.audit = state.audit.slice(0, 150);
  }

  function toast(message, type = "success") {
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.textContent = message;
    $("#toastRegion").append(el);
    setTimeout(() => el.remove(), 3800);
  }

  // Sesión y Autenticación
  function setUser(u) {
    currentUser = u;
    sessionStorage.setItem("bsc_techperu_user", JSON.stringify({
      id: u.id,
      email: u.email,
      role: u.role,
      name: u.name,
      area: u.area
    }));
  }

  function restoreUser() {
    try {
      const d = JSON.parse(sessionStorage.getItem("bsc_techperu_user"));
      if (d) {
        const match = users.find(u => u.email.toLowerCase() === d.email.toLowerCase());
        if (match) {
          currentUser = { ...match };
          return true;
        }
      }
    } catch (e) {}
    return false;
  }

  function showApp() {
    $("#loginView").classList.add("hidden");
    $("#appView").classList.remove("hidden");
    $("#sideUserName").textContent = currentUser.name;
    $("#topUserName").textContent = currentUser.name;
    $("#sideUserRole").textContent = currentUser.role;
    $("#topUserRole").textContent = currentUser.role;

    const initials = currentUser.name.split(" ").map(x => x[0]).slice(0, 2).join("").toUpperCase();
    $("#sideUserAvatar").textContent = initials;
    $("#topUserAvatar").textContent = initials;

    updateCriticalBadge();
    renderPage(currentPage);
  }

  function showLogin() {
    $("#appView").classList.add("hidden");
    $("#loginView").classList.remove("hidden");
  }

  function login(email, password) {
    const u = users.find(x => x.email.toLowerCase() === email.toLowerCase() && x.password === password);
    if (!u) return false;
    setUser({ ...u });
    showApp();
    return true;
  }

  function logout() {
    sessionStorage.removeItem("bsc_techperu_user");
    currentUser = null;
    showLogin();
    toast("Sesión cerrada correctamente");
  }

  function updateCriticalBadge() {
    const badCount = state.kpis.filter(k => statusOf(k).key === "bad").length;
    const badge = $("#notificationBadge");
    if (badge) {
      badge.textContent = badCount;
      badge.classList.toggle("hidden", badCount === 0);
    }
  }

  // Navegación
  function navigate(page) {
    if (!page) return;
    currentPage = page;
    $("#sidebar").classList.remove("open");
    renderPage(page);
    history.replaceState(null, "", "#" + page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const pageTitles = {
    dashboard: "Dashboard ejecutivo",
    "bsc-completo": "BSC Completo (36 KPIs)",
    mapa: "Mapa estratégico",
    objetivos: "Objetivos estratégicos",
    kpis: "Catálogo de KPIs",
    mediciones: "Registro de resultados",
    iniciativas: "Iniciativas estratégicas",
    reportes: "Reportes y Exportación",
    administracion: "Administración"
  };

  function renderPage(page) {
    currentPage = page;
    $("#breadcrumbPage").textContent = pageTitles[page] || "Dashboard ejecutivo";
    $$(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.page === page));

    destroyCharts();
    const fn = renderers[page] || renderDashboard;
    $("#pageContent").innerHTML = fn();
    bindPageEvents(page);

    if (page === "dashboard") drawDashboardCharts();
    if (page === "reportes") drawReportCharts();

    $("#pageContent").focus({ preventScroll: true });
  }

  function destroyCharts() {
    Object.values(charts).forEach(c => {
      try { c.destroy(); } catch (e) {}
    });
    charts = {};
  }

  function pageHead(title, desc, actions = "") {
    return `
      <div class="page-head">
        <div>
          <h1>${title}</h1>
          <p>${desc}</p>
        </div>
        <div class="head-actions">${actions}</div>
      </div>
    `;
  }

  function metricCard(label, value, foot, icon, trendClass = "trend-up") {
    return `
      <article class="metric-card">
        <div class="metric-top">
          <span>${label}</span>
          <span class="metric-icon">${icon}</span>
        </div>
        <div class="metric-value">${value}</div>
        <div class="metric-foot ${trendClass}">${foot}</div>
      </article>
    `;
  }

  // -------------------------------------------------------------
  // MÓDULO 2: DASHBOARD EJECUTIVO (TechPeru SAC 2025)
  // -------------------------------------------------------------
  function renderDashboard() {
    const global = globalCompliance();
    const good = state.kpis.filter(k => statusOf(k).key === "good").length;
    const warn = state.kpis.filter(k => statusOf(k).key === "warn").length;
    const bad = state.kpis.filter(k => statusOf(k).key === "bad").length;
    const criticalList = state.kpis.filter(k => statusOf(k).key === "bad");

    return `
      ${pageHead(
        "Dashboard ejecutivo — TechPeru SAC 2025",
        "Resumen integral de desempeño estratégico según las 4 perspectivas del Balanced Scorecard.",
        `<button class="btn" data-action="go-bsc-completo">📊 Ver BSC Completo</button>
         <button class="btn primary" data-action="new-measurement">＋ Registrar resultado</button>`
      )}

      <!-- 4 Tarjetas Métricas Superiores -->
      <div class="grid metric-grid">
        ${metricCard(
          "Cumplimiento Estratégico Global",
          global === null ? "—" : fmt(global) + "%",
          `<span class="${global >= 90 ? 'trend-up' : global >= 75 ? 'trend-warn' : 'trend-down'}">
            ${global >= 90 ? '✅ LOGRADO' : global >= 75 ? '⚠ EN RIESGO' : '❌ CRÍTICO'} · 36 KPIs evaluados
          </span>`,
          "📈",
          global >= 75 ? "trend-warn" : "trend-down"
        )}

        ${metricCard(
          "Objetivos Estratégicos",
          state.objectives.length,
          `<span class="trend-up">12 de 12 activos (4 perspectivas)</span>`,
          "◎",
          "trend-up"
        )}

        ${metricCard(
          "KPIs en Cumplimiento",
          `${good} de ${state.kpis.length}`,
          `<span class="trend-up">${fmt((good / state.kpis.length) * 100, 0)}% cumplen la meta anual (≥90%)</span>`,
          "✓",
          "trend-up"
        )}

        ${metricCard(
          "Indicadores que Requieren Atención",
          `${bad + warn}`,
          `<span class="trend-down">${bad} críticos (&lt;75%) · ${warn} en riesgo</span>`,
          "⚑",
          "trend-down"
        )}
      </div>

      <!-- Resumen Gráfico Central -->
      <div class="grid dashboard-grid">
        <section class="panel">
          <div class="panel-head">
            <div>
              <h2>Desempeño por Perspectiva</h2>
              <p>Promedio de cumplimiento por cada una de las 4 perspectivas del BSC</p>
            </div>
            <span class="tag">Meta ≥ 90%</span>
          </div>
          <div class="perspective-bars">
            ${perspectiveBreakdown().map(p => `
              <div class="perspective-row">
                <div class="perspective-name">
                  <span class="persp-dot" style="background:${p.color}"></span>
                  <strong>${p.icon} ${p.label}</strong>
                </div>
                <div class="progress-track">
                  <div class="progress-fill" style="width:${Math.min(100, p.pct || 0)}%; background:${p.color}"></div>
                </div>
                <div class="perspective-value">${p.pct !== null ? fmt(p.pct) + "%" : "—"}</div>
              </div>
            `).join("")}
          </div>
          <div class="chart-wrap short" style="margin-top:20px;">
            <canvas id="perspectiveChart" aria-label="Gráfico de barras por perspectiva"></canvas>
          </div>
        </section>

        <section class="panel">
          <div class="panel-head">
            <div>
              <h2>Tendencia Histórica 2025</h2>
              <p>Evolución mensual del porcentaje de cumplimiento global</p>
            </div>
            <button class="panel-action" data-action="go-reportes">Ver detalles →</button>
          </div>
          <div class="chart-wrap">
            <canvas id="trendChart" aria-label="Tendencia mensual"></canvas>
          </div>
        </section>
      </div>

      <!-- MATRIZ EJECUTIVA EN 4 CUADRANTES (Idéntica a la hoja 📈 Dashboard del PDF) -->
      <section class="panel" style="margin-bottom: 24px;">
        <div class="panel-head">
          <div>
            <h2>Matriz Ejecutiva por Perspectivas — TechPeru SAC 2025</h2>
            <p>Monitoreo simultáneo de los 36 indicadores organizados en sus 4 perspectivas (Haz clic en cualquier fila para ver el detalle)</p>
          </div>
          <span class="tag">36 KPIs Evaluados</span>
        </div>

        <div class="quadrant-grid">
          ${renderExecutiveQuadrant("financiera", "💰 PERSPECTIVA FINANCIERA", "fin")}
          ${renderExecutiveQuadrant("clientes", "👥 PERSPECTIVA DE CLIENTES", "cli")}
          ${renderExecutiveQuadrant("procesos", "🔧 PERSPECTIVA DE PROCESOS INTERNOS", "pro")}
          ${renderExecutiveQuadrant("aprendizaje", "📚 PERSPECTIVA DE APRENDIZAJE Y CRECIMIENTO", "apr")}
        </div>
      </section>

      <!-- Tabla de Indicadores Críticos Urgentes con Acciones Recomendadas -->
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>Indicadores Críticos que Requieren Acción Inmediata (&lt; 75%)</h2>
            <p>Prioridad urgente para el comité de dirección de TechPeru SAC</p>
          </div>
          <button class="panel-action" data-action="go-bsc-completo">Ver todos los 36 KPIs →</button>
        </div>
        ${renderKpiTable(criticalList, true)}
      </section>
    `;
  }

  // Renderizar cada cuadrante ejecutivo del Dashboard
  function renderExecutiveQuadrant(perspectiveKey, title, cssClass) {
    const list = state.kpis.filter(k => k.perspective === perspectiveKey);
    return `
      <div class="quadrant-card">
        <div class="quadrant-header ${cssClass}">
          <span>${title}</span>
          <small>${list.length} KPIs</small>
        </div>
        <div class="table-scroll">
          <table class="quadrant-table">
            <thead>
              <tr>
                <th>KPI</th>
                <th>Meta</th>
                <th>Real</th>
                <th>% Cumpl.</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(k => {
                const s = statusOf(k);
                return `
                  <tr style="cursor:pointer;" data-action="kpi-detail" data-id="${k.id}" title="Ver detalle de ${k.name}">
                    <td>
                      <span class="code" style="font-size:9px;">${k.id}</span>
                      <strong style="display:inline-block; margin-left:4px;">${escapeHtml(k.name)}</strong>
                    </td>
                    <td>${fmt(k.target, 1)} ${escapeHtml(k.unit)}</td>
                    <td><strong>${fmt(k.current, 1)}</strong></td>
                    <td style="font-family:'JetBrains Mono', monospace; font-weight:700;">
                      ${s.pct !== null ? fmt(s.pct) + "%" : "—"}
                    </td>
                    <td>${statusBadge(k)}</td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // MÓDULO ADICIONAL: BSC COMPLETO (36 KPIs de la hoja del Excel)
  // -------------------------------------------------------------
  function renderBscCompleto() {
    return `
      ${pageHead(
        "Balanced Scorecard Completo — TechPeru SAC 2025",
        "Resumen estructurado de los 36 indicadores de gestión con semaforización ejecutiva y acciones recomendadas.",
        `<button class="btn" data-action="export-bsc-csv">↓ Exportar Excel / CSV</button>
         <button class="btn" data-action="print-report">⎙ Imprimir / PDF</button>`
      )}

      <!-- Pestañas de filtrado por perspectiva -->
      <div class="tabs-nav" id="bscPerspectiveTabs">
        <button class="tab-btn active" data-persp="todas">Todas las Perspectivas (36)</button>
        <button class="tab-btn" data-persp="financiera">💰 Financiera (9)</button>
        <button class="tab-btn" data-persp="clientes">👥 Clientes (9)</button>
        <button class="tab-btn" data-persp="procesos">🔧 Procesos (9)</button>
        <button class="tab-btn" data-persp="aprendizaje">📚 Aprendizaje (9)</button>
      </div>

      <div class="toolbar">
        <div class="search-box">
          <input id="bscSearch" placeholder="Buscar por código, indicador, objetivo o recomendación…">
        </div>
        <select id="bscStatusFilter">
          <option value="">Todos los Estados</option>
          <option value="good">✅ Logrado (≥90%)</option>
          <option value="warn">⚠ En riesgo (75–89%)</option>
          <option value="bad">❌ Crítico (&lt;75%)</option>
        </select>
        <select id="bscDirectionFilter">
          <option value="">Todos los Sentidos</option>
          <option value="mayor">Mayor es mejor (Directo)</option>
          <option value="menor">Menor es mejor (Inverso)</option>
        </select>
      </div>

      <div id="bscTableContainer" class="table-panel">
        ${renderBscFullTable(state.kpis)}
      </div>
    `;
  }

  function renderBscFullTable(list) {
    if (!list.length) {
      return `<div class="empty-state"><strong>No se encontraron indicadores</strong>Prueba con otros criterios de búsqueda o limpia los filtros.</div>`;
    }

    return `
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Perspectiva</th>
              <th>Objetivo Estratégico</th>
              <th>Código / Indicador (KPI)</th>
              <th>Unidad</th>
              <th>Meta Anual</th>
              <th>Real Acum.</th>
              <th>% Cumpl.</th>
              <th>Estado</th>
              <th>Análisis / Acción Recomendada</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(k => {
              const p = perspectives[k.perspective];
              const s = statusOf(k);
              const obj = state.objectives.find(o => o.id === k.objectiveId);
              return `
                <tr>
                  <td>
                    <span class="tag" style="background:${p.soft}; color:${p.color}; font-weight:700;">
                      ${p.icon} ${p.label}
                    </span>
                  </td>
                  <td>
                    <strong style="color:var(--ink);">${escapeHtml(obj?.id || "")}</strong>
                    <span class="subcell">${escapeHtml(obj?.name || "Sin objetivo")}</span>
                  </td>
                  <td>
                    <span class="code">${escapeHtml(k.id)}</span>
                    <strong style="display:block; margin-top:2px;">${escapeHtml(k.name)}</strong>
                    <small style="color:var(--muted); font-size:10px;">${k.direction === 'menor' ? '⬇ Menor=Mejor' : '⬆ Mayor=Mejor'}</small>
                  </td>
                  <td><span class="tag">${escapeHtml(k.unit)}</span></td>
                  <td><b>${fmt(k.target, 1)}</b></td>
                  <td><strong style="color:var(--ink);">${fmt(k.current, 1)}</strong></td>
                  <td style="font-family:'JetBrains Mono', monospace; font-weight:800; font-size:12px;">
                    ${s.pct !== null ? fmt(s.pct, 1) + "%" : "—"}
                  </td>
                  <td>${statusBadge(k)}</td>
                  <td style="max-width:320px; white-space:normal; font-size:11px; line-height:1.4; color:#334155;">
                    <div class="action-recommendation-box" style="padding:6px 10px; font-size:11px;">
                      ${escapeHtml(k.recommendation || k.description)}
                    </div>
                  </td>
                  <td>
                    <div class="table-actions">
                      <button class="text-action" data-action="kpi-detail" data-id="${k.id}">Ficha</button>
                      <button class="text-action" data-action="measure-kpi" data-id="${k.id}">Medir</button>
                      ${canEdit() ? `<button class="text-action" data-action="edit-kpi" data-id="${k.id}">Editar</button>` : ""}
                    </div>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
      <div class="table-bottom">
        <span>Mostrando <b>${list.length}</b> de 36 indicadores oficiales de TechPeru SAC</span>
        <span>Criterio: Verde ≥90% | Ámbar 75–89% | Rojo &lt;75% · Inversos: Meta / Real × 100</span>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // MÓDULO 3: MAPA ESTRATÉGICO INTERACTIVO
  // -------------------------------------------------------------
  function renderMap() {
    const lanes = ["financiera", "clientes", "procesos", "aprendizaje"].map((key, idx) => {
      const p = perspectives[key];
      const objs = state.objectives.filter(o => o.perspective === key);
      return `
        <div class="map-lane">
          <div class="map-lane-label" style="background:${p.soft}; color:${p.color};">
            <span>${p.icon} ${p.label}</span>
            <small>${objs.length} Objetivos estratégicos</small>
          </div>
          <div class="map-lane-items">
            ${objs.map(o => {
              const ks = state.kpis.filter(k => k.objectiveId === o.id);
              const valid = ks.map(k => achievement(k)).filter(p => p !== null);
              const avg = valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : null;
              const col = avg === null ? "#94a3b8" : avg >= 90 ? "#059669" : avg >= 75 ? "#d97706" : "#dc2626";

              return `
                <button class="map-objective" data-action="objective-detail" data-id="${o.id}" title="Clic para ver detalle de ${o.name}">
                  <span class="mini-status" style="background:${col};"></span>
                  <span class="code" style="font-size:9px; margin-bottom:4px;">${o.id}</span>
                  <strong>${escapeHtml(o.name)}</strong>
                  <small>${ks.length} KPIs asociados · ${avg === null ? "Sin mediciones" : fmt(avg) + "% cumpl."}</small>
                </button>
              `;
            }).join("")}
          </div>
        </div>
        ${idx < 3 ? `
          <div class="map-flow-indicator">
            <span>▲ Causa y Efecto: Esta perspectiva impulsa a la perspectiva superior ▲</span>
          </div>
        ` : ""}
      `;
    }).join("");

    return `
      ${pageHead(
        "Mapa Estratégico — TechPeru SAC 2025",
        "Visualiza la hipótesis estratégica y relaciones de causa-efecto entre las cuatro perspectivas.",
        `<button class="btn" data-action="print-report">⎙ Imprimir mapa</button>
         ${canEdit() ? `<button class="btn primary" data-action="new-objective">＋ Nuevo objetivo</button>` : ""}`
      )}

      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>Mapa de Objetivos Estratégicos (12 Objetivos)</h2>
            <p>Selecciona cualquier objetivo para consultar sus indicadores, iniciativas asociadas y estado de avance.</p>
          </div>
          <div class="map-legend">
            <span class="legend-item"><i class="legend-dot" style="background:#059669"></i> Logrado (≥90%)</span>
            <span class="legend-item"><i class="legend-dot" style="background:#d97706"></i> En riesgo (75–89%)</span>
            <span class="legend-item"><i class="legend-dot" style="background:#dc2626"></i> Crítico (&lt;75%)</span>
          </div>
        </div>

        <div class="strategy-map">
          ${lanes}
        </div>
      </section>

      <!-- Matriz de Relaciones Causa-Efecto -->
      <div class="grid dashboard-grid" style="margin-top:20px;">
        <section class="panel">
          <div class="panel-head">
            <div>
              <h2>Lógica de Causa y Efecto del Balanced Scorecard</h2>
              <p>Fundamento estratégico de TechPeru SAC</p>
            </div>
          </div>
          <div class="info-box" style="font-size:12px; line-height:1.7;">
            <strong>1. Aprendizaje y Crecimiento:</strong> Fortalecer el talento humano y fomentar la innovación Kaizen.<br>
            <strong>↓ Impulsa:</strong><br>
            <strong>2. Procesos Internos:</strong> La excelencia operativa, aseguramiento de calidad (Six Sigma) y reducción de incidencias con proveedores.<br>
            <strong>↓ Impulsa:</strong><br>
            <strong>3. Clientes:</strong> Máxima satisfacción (CSAT), recomendación (NPS) y fidelización con menor abandono (Churn).<br>
            <strong>↓ Impulsa:</strong><br>
            <strong>4. Financiera:</strong> Crecimiento sostenido en ventas, retorno sobre patrimonio (ROE 18%) y estructura de costos óptima.
          </div>
        </section>

        <section class="panel">
          <div class="panel-head">
            <div>
              <h2>Resumen por Perspectiva</h2>
              <p>Distribución de los 12 objetivos</p>
            </div>
          </div>
          <div class="perspective-bars">
            ${perspectiveBreakdown().map(p => `
              <div class="perspective-row">
                <div class="perspective-name">
                  <span class="persp-dot" style="background:${p.color}"></span>
                  <span>${p.icon} ${p.label}</span>
                </div>
                <div class="progress-track">
                  <div class="progress-fill" style="width:${(state.objectives.filter(o => o.perspective === p.key).length / state.objectives.length) * 100}%; background:${p.color}"></div>
                </div>
                <div class="perspective-value">${state.objectives.filter(o => o.perspective === p.key).length} obj</div>
              </div>
            `).join("")}
          </div>
        </section>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // MÓDULO 4: GESTIÓN DE OBJETIVOS ESTRATÉGICOS
  // -------------------------------------------------------------
  function renderObjectives() {
    return `
      ${pageHead(
        "Objetivos Estratégicos — TechPeru SAC",
        "Define, edita y supervisa los 12 objetivos estratégicos y su alineación con el mapa.",
        `${canEdit() ? `<button class="btn primary" data-action="new-objective">＋ Nuevo objetivo</button>` : ""}`
      )}

      <div class="toolbar">
        <div class="search-box">
          <input id="objSearch" placeholder="Buscar por código, objetivo o responsable…">
        </div>
        <select id="objPerspective">
          <option value="">Todas las perspectivas</option>
          ${Object.entries(perspectives).map(([k, p]) => `<option value="${k}">${p.icon} ${p.label}</option>`).join("")}
        </select>
        <select id="objStatus">
          <option value="">Todos los estados</option>
          <option>Activo</option>
          <option>En revisión</option>
          <option>Inactivo</option>
        </select>
        <select id="objPriority">
          <option value="">Todas las prioridades</option>
          <option>Alta</option>
          <option>Media</option>
          <option>Baja</option>
        </select>
      </div>

      <div id="objectiveTableWrap" class="table-panel">
        ${objectivesTable(state.objectives)}
      </div>
    `;
  }

  function objectivesTable(items) {
    return `
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Objetivo Estratégico</th>
              <th>Perspectiva</th>
              <th>Responsable</th>
              <th>Prioridad</th>
              <th>KPIs Asociados</th>
              <th>Cumplimiento</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(o => {
              const ks = state.kpis.filter(k => k.objectiveId === o.id);
              const valid = ks.map(k => achievement(k)).filter(p => p !== null);
              const avg = valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : null;
              const p = perspectives[o.perspective];

              return `
                <tr>
                  <td><span class="code">${escapeHtml(o.id)}</span></td>
                  <td>
                    <span class="table-title">${escapeHtml(o.name)}</span>
                    <span class="subcell">${escapeHtml(o.description)}</span>
                  </td>
                  <td>
                    <span class="tag" style="background:${p?.soft || '#f1f5f9'}; color:${p?.color || '#334155'}; font-weight:700;">
                      ${p?.icon || ''} ${escapeHtml(perspectiveLabel(o.perspective))}
                    </span>
                  </td>
                  <td>${escapeHtml(o.owner)}</td>
                  <td><span class="tag">${escapeHtml(o.priority)}</span></td>
                  <td><b>${ks.length}</b> KPI(s)</td>
                  <td style="font-family:'JetBrains Mono', monospace; font-weight:700;">
                    ${avg !== null ? fmt(avg) + "%" : "—"}
                  </td>
                  <td><span class="status ${o.status === 'Activo' ? 'good' : 'neutral'}">${escapeHtml(o.status)}</span></td>
                  <td>
                    <div class="table-actions">
                      <button class="text-action" data-action="objective-detail" data-id="${o.id}">Ver</button>
                      ${canEdit() ? `
                        <button class="text-action" data-action="edit-objective" data-id="${o.id}">Editar</button>
                        <button class="text-action" data-action="delete-objective" data-id="${o.id}">Eliminar</button>
                      ` : ""}
                    </div>
                  </td>
                </tr>
              `;
            }).join("") || `<tr><td colspan="9"><div class="empty-state">No se encontraron objetivos con los filtros seleccionados.</div></td></tr>`}
          </tbody>
        </table>
      </div>
      <div class="table-bottom">
        <span>${items.length} objetivo(s) en total</span>
        <span>Las modificaciones actualizan automáticamente el Mapa Estratégico y el Dashboard.</span>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // MÓDULO 5: CATÁLOGO Y GESTIÓN DE INDICADORES (KPI)
  // -------------------------------------------------------------
  function renderKpis() {
    const good = state.kpis.filter(k => statusOf(k).key === "good").length;
    const warn = state.kpis.filter(k => statusOf(k).key === "warn").length;
    const bad = state.kpis.filter(k => statusOf(k).key === "bad").length;

    return `
      ${pageHead(
        "Catálogo de Indicadores KPI — TechPeru SAC 2025",
        "Administración detallada de los 36 indicadores, fórmulas, metas, línea base y semáforo de desempeño.",
        `${canEdit() ? `<button class="btn primary" data-action="new-kpi">＋ Nuevo indicador</button>` : ""}`
      )}

      <div class="grid metric-grid">
        ${metricCard("Total Indicadores", state.kpis.length, "36 KPIs oficiales en el BSC", "▥")}
        ${metricCard("Logrados (≥90%)", good, `${fmt((good / state.kpis.length) * 100, 0)}% del total evaluado`, "✓", "trend-up")}
        ${metricCard("En Riesgo (75–89%)", warn, "Requieren seguimiento", "⚠", "trend-warn")}
        ${metricCard("Críticos (<75%)", bad, "Plan de acción correctivo", "✕", "trend-down")}
      </div>

      <div class="toolbar">
        <div class="search-box">
          <input id="kpiSearch" placeholder="Buscar por código, nombre o fórmula…">
        </div>
        <select id="kpiPerspective">
          <option value="">Todas las perspectivas</option>
          ${Object.entries(perspectives).map(([k, p]) => `<option value="${k}">${p.icon} ${p.label}</option>`).join("")}
        </select>
        <select id="kpiOwner">
          <option value="">Todos los responsables</option>
          ${[...new Set(state.kpis.map(k => k.owner))].map(x => `<option>${escapeHtml(x)}</option>`).join("")}
        </select>
        <select id="kpiStatus">
          <option value="">Todos los estados</option>
          <option value="good">Logrado (≥90%)</option>
          <option value="warn">En riesgo (75–89%)</option>
          <option value="bad">Crítico (&lt;75%)</option>
        </select>
      </div>

      <div id="kpiTableWrap" class="table-panel">
        ${kpisFullTable(state.kpis)}
      </div>
    `;
  }

  function kpisFullTable(items) {
    return `
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Código / Indicador</th>
              <th>Perspectiva</th>
              <th>Objetivo Asociado</th>
              <th>Línea Base</th>
              <th>Meta</th>
              <th>Real Acum.</th>
              <th>% Cumpl.</th>
              <th>Sentido</th>
              <th>Responsable</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(k => {
              const s = statusOf(k);
              const p = perspectives[k.perspective];
              return `
                <tr>
                  <td>
                    <span class="code">${escapeHtml(k.id)}</span>
                    <strong style="display:block; margin-top:3px;">${escapeHtml(k.name)}</strong>
                  </td>
                  <td>
                    <span class="tag" style="background:${p?.soft || '#f1f5f9'}; color:${p?.color || '#334155'}; font-weight:700;">
                      ${p?.icon || ''} ${escapeHtml(perspectiveLabel(k.perspective))}
                    </span>
                  </td>
                  <td>
                    <span class="table-title">${escapeHtml(objectiveName(k.objectiveId))}</span>
                  </td>
                  <td>${fmt(k.baseline, 1)} ${escapeHtml(k.unit)}</td>
                  <td><b>${fmt(k.target, 1)} ${escapeHtml(k.unit)}</b></td>
                  <td><strong style="color:var(--ink);">${fmt(k.current, 1)} ${escapeHtml(k.unit)}</strong></td>
                  <td style="font-family:'JetBrains Mono', monospace; font-weight:800; font-size:12px;">
                    ${s.pct !== null ? fmt(s.pct, 1) + "%" : "—"}
                  </td>
                  <td>
                    <span class="tag">${k.direction === 'menor' ? '⬇ Menor=Mejor' : '⬆ Mayor=Mejor'}</span>
                  </td>
                  <td>${escapeHtml(k.owner)}</td>
                  <td>${statusBadge(k)}</td>
                  <td>
                    <div class="table-actions">
                      <button class="text-action" data-action="kpi-detail" data-id="${k.id}">Ficha</button>
                      <button class="text-action" data-action="measure-kpi" data-id="${k.id}">Medir</button>
                      ${canEdit() ? `
                        <button class="text-action" data-action="edit-kpi" data-id="${k.id}">Editar</button>
                        <button class="text-action" data-action="delete-kpi" data-id="${k.id}">Eliminar</button>
                      ` : ""}
                    </div>
                  </td>
                </tr>
              `;
            }).join("") || `<tr><td colspan="11"><div class="empty-state">No hay indicadores que coincidan con la búsqueda.</div></td></tr>`}
          </tbody>
        </table>
      </div>
      <div class="table-bottom">
        <span>${items.length} indicador(es) mostrados</span>
        <span>Semáforo: Verde ≥90% | Ámbar 75–89% | Rojo &lt;75%</span>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // MÓDULO 6: REGISTRO DE RESULTADOS (MEDICIONES)
  // -------------------------------------------------------------
  function renderMeasurements() {
    const all = state.kpis.flatMap(k => k.measurements.map(m => ({ ...m, kpi: k }))).sort((a, b) => b.date.localeCompare(a.date));

    return `
      ${pageHead(
        "Registro de Resultados — TechPeru SAC 2025",
        "Ingresa valores reales para los indicadores y actualiza en tiempo real el cumplimiento del BSC.",
        `<button class="btn primary" data-action="new-measurement">＋ Registrar medición</button>`
      )}

      <div class="grid metric-grid">
        ${metricCard("Total Mediciones", all.length, "Historial consolidado 2025", "↗")}
        ${metricCard("KPIs con Datos", state.kpis.filter(k => k.measurements.length > 0).length, "36 de 36 activos", "▥", "trend-up")}
        ${metricCard("Último Período", all[0]?.period || "2025-06", "Cierre acumulado", "◷")}
        ${metricCard("Cumplimiento Global", fmt(globalCompliance()) + "%", "Índice BSC TechPeru SAC", "📈", globalCompliance() >= 75 ? "trend-warn" : "trend-down")}
      </div>

      <div class="toolbar">
        <div class="search-box">
          <input id="measurementSearch" placeholder="Buscar por indicador, notas o responsable…">
        </div>
        <select id="measurementKpi">
          <option value="">Todos los KPIs</option>
          ${state.kpis.map(k => `<option value="${k.id}">${k.id} · ${escapeHtml(k.name)}</option>`).join("")}
        </select>
        <input id="measurementMonth" type="month" value="2025-06" aria-label="Filtrar por período">
        <button class="btn" data-action="export-measurements">↓ Exportar CSV</button>
      </div>

      <div id="measurementTableWrap" class="table-panel">
        ${measurementTable(all)}
      </div>
    `;
  }

  function measurementTable(items) {
    return `
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Período</th>
              <th>Indicador</th>
              <th>Meta</th>
              <th>Valor Obtenido</th>
              <th>Cumplimiento</th>
              <th>Estado</th>
              <th>Responsable</th>
              <th>Observaciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(x => {
              const s = statusOf(x.kpi, x.value);
              return `
                <tr>
                  <td>${escapeHtml(x.date)}</td>
                  <td><span class="tag">${escapeHtml(x.period)}</span></td>
                  <td>
                    <span class="code">${escapeHtml(x.kpi.id)}</span>
                    <strong style="display:inline-block; margin-left:4px;">${escapeHtml(x.kpi.name)}</strong>
                  </td>
                  <td>${fmt(x.kpi.target, 1)} ${escapeHtml(x.kpi.unit)}</td>
                  <td><strong style="color:var(--ink);">${fmt(x.value, 1)} ${escapeHtml(x.kpi.unit)}</strong></td>
                  <td style="font-family:'JetBrains Mono', monospace; font-weight:700;">
                    ${s.pct !== null ? fmt(s.pct, 1) + "%" : "—"}
                  </td>
                  <td>${statusBadge(x.kpi, x.value)}</td>
                  <td>${escapeHtml(x.responsible || x.kpi.owner)}</td>
                  <td style="max-width:260px; white-space:normal; font-size:11px; color:#475569;">
                    ${escapeHtml(x.notes || "—")}
                  </td>
                  <td>
                    <button class="text-action" data-action="edit-measurement" data-kpi="${x.kpi.id}" data-id="${x.id}">Editar</button>
                  </td>
                </tr>
              `;
            }).join("") || `<tr><td colspan="10"><div class="empty-state">No hay registros de medición en el período seleccionado.</div></td></tr>`}
          </tbody>
        </table>
      </div>
      <div class="table-bottom">
        <span>${items.length} medición(es) encontradas</span>
        <span>Al registrar una medición reciente se recalculan automáticamente el Dashboard, el BSC y los Reportes.</span>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // MÓDULO 7: INICIATIVAS ESTRATÉGICAS
  // -------------------------------------------------------------
  function renderInitiatives() {
    const totalBudget = state.initiatives.reduce((acc, i) => acc + (Number(i.budget) || 0), 0);
    const avgProgress = state.initiatives.length ? state.initiatives.reduce((acc, i) => acc + (Number(i.progress) || 0), 0) / state.initiatives.length : 0;

    return `
      ${pageHead(
        "Iniciativas Estratégicas — TechPeru SAC 2025",
        "Proyectos y planes de acción vinculados a los objetivos y KPIs para asegurar el cumplimiento del BSC.",
        `${canEdit() ? `<button class="btn primary" data-action="new-initiative">＋ Nueva iniciativa</button>` : ""}`
      )}

      <div class="grid metric-grid">
        ${metricCard("Portafolio Activo", state.initiatives.length, "8 iniciativas estratégicas", "◈")}
        ${metricCard("Presupuesto Total", currency(totalBudget), "Inversión aprobada 2025", "💰")}
        ${metricCard("Avance Promedio", fmt(avgProgress, 0) + "%", "Seguimiento al cierre Q2", "↗", avgProgress >= 50 ? "trend-up" : "trend-warn")}
        ${metricCard("En Riesgo", state.initiatives.filter(i => i.status === "En riesgo").length, "Requieren atención inmediata", "⚠", "trend-down")}
      </div>

      <div class="toolbar">
        <div class="search-box">
          <input id="initiativeSearch" placeholder="Buscar iniciativa, objetivo o responsable…">
        </div>
        <select id="initiativeStatus">
          <option value="">Todos los estados</option>
          <option>Planificada</option>
          <option>En ejecución</option>
          <option>En riesgo</option>
          <option>Finalizada</option>
        </select>
        <select id="initiativeOwner">
          <option value="">Todos los responsables</option>
          ${[...new Set(state.initiatives.map(i => i.owner))].map(n => `<option>${escapeHtml(n)}</option>`).join("")}
        </select>
      </div>

      <div id="initiativeTableWrap" class="table-panel">
        ${initiativesTable(state.initiatives)}
      </div>
    `;
  }

  function initiativesTable(items) {
    return `
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Código / Iniciativa</th>
              <th>Objetivo & KPI Vinculado</th>
              <th>Responsable & Área</th>
              <th>Cronograma</th>
              <th>Presupuesto</th>
              <th>Avance</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(i => {
              const k = state.kpis.find(x => x.id === i.kpiId);
              return `
                <tr>
                  <td>
                    <span class="code">${escapeHtml(i.id)}</span>
                    <strong style="display:block; margin-top:2px;">${escapeHtml(i.name)}</strong>
                  </td>
                  <td>
                    <strong>${escapeHtml(objectiveName(i.objectiveId))}</strong>
                    <span class="subcell">${k ? `${k.id} · ${k.name} (${statusOf(k).badge})` : "Sin KPI asociado"}</span>
                  </td>
                  <td>
                    ${escapeHtml(i.owner)}
                    <span class="subcell">${escapeHtml(i.area)}</span>
                  </td>
                  <td>
                    <span style="font-size:11px;">${escapeHtml(i.start)} al ${escapeHtml(i.end)}</span>
                  </td>
                  <td><b>${currency(i.budget)}</b></td>
                  <td>
                    <div class="initiative-progress">
                      <div class="progress-track">
                        <div class="progress-fill" style="width:${Math.max(0, Math.min(100, i.progress))}%; background:${i.progress >= 70 ? '#059669' : i.progress >= 40 ? '#2563eb' : '#d97706'};"></div>
                      </div>
                      <b>${fmt(i.progress, 0)}%</b>
                    </div>
                  </td>
                  <td>
                    <span class="status ${i.status === 'Finalizada' ? 'good' : i.status === 'En riesgo' ? 'bad' : i.status === 'Planificada' ? 'neutral' : 'blue'}">
                      ${escapeHtml(i.status)}
                    </span>
                  </td>
                  <td>
                    <div class="table-actions">
                      <button class="text-action" data-action="initiative-detail" data-id="${i.id}">Detalle</button>
                      ${canEdit() ? `
                        <button class="text-action" data-action="edit-initiative" data-id="${i.id}">Editar</button>
                        <button class="text-action" data-action="delete-initiative" data-id="${i.id}">Eliminar</button>
                      ` : ""}
                    </div>
                  </td>
                </tr>
              `;
            }).join("") || `<tr><td colspan="8"><div class="empty-state">No hay iniciativas registradas.</div></td></tr>`}
          </tbody>
        </table>
      </div>
      <div class="table-bottom">
        <span>${items.length} iniciativa(s) estratégica(s)</span>
        <span>Alineadas con los requerimientos de mejora identificados en el Cuadro de Mando 2025.</span>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // MÓDULO 8: REPORTES Y EXPORTACIÓN
  // -------------------------------------------------------------
  function renderReports() {
    return `
      ${pageHead(
        "Reportes Ejecutivos — TechPeru SAC 2025",
        "Generación y exportación de informes estratégicos para el Directorio y Comités de Gestión.",
        `<button class="btn" data-action="print-report">⎙ Imprimir / Guardar en PDF</button>
         <button class="btn primary" data-action="export-report-csv">↓ Exportar a CSV</button>`
      )}

      <!-- Tipos de Reporte -->
      <div class="grid report-cards">
        <article class="report-card">
          <div class="report-icon">📊</div>
          <h3>Reporte General del BSC</h3>
          <p>Informe ejecutivo consolidado con el semáforo de los 36 KPIs y cumplimiento global de 84.2%.</p>
          <button class="btn small primary" data-action="report-type" data-type="general">Generar Reporte →</button>
        </article>

        <article class="report-card">
          <div class="report-icon">🎯</div>
          <h3>Reporte por Perspectiva</h3>
          <p>Análisis comparativo de Financiera, Clientes, Procesos y Aprendizaje con sus brechas estratégicas.</p>
          <button class="btn small" data-action="report-type" data-type="perspectivas">Generar Reporte →</button>
        </article>

        <article class="report-card">
          <div class="report-icon">⚠️</div>
          <h3>Indicadores Críticos y en Riesgo</h3>
          <p>Listado de los 6 KPIs críticos (&lt;75%) y 19 en riesgo con sus acciones correctivas recomendadas.</p>
          <button class="btn small" data-action="report-type" data-type="criticos">Generar Reporte →</button>
        </article>

        <article class="report-card">
          <div class="report-icon">◈</div>
          <h3>Portafolio de Iniciativas</h3>
          <p>Estado de avance, presupuestos ejecutados y cronogramas de los 8 proyectos estratégicos.</p>
          <button class="btn small" data-action="report-type" data-type="iniciativas">Generar Reporte →</button>
        </article>

        <article class="report-card">
          <div class="report-icon">↗</div>
          <h3>Historial Mensual de Mediciones</h3>
          <p>Resultados históricos registrados mes a mes durante 2025 con notas y responsables.</p>
          <button class="btn small" data-action="report-type" data-type="mediciones">Generar Reporte →</button>
        </article>

        <article class="report-card">
          <div class="report-icon">⚙</div>
          <h3>Ficha Técnica Detallada de KPIs</h3>
          <p>Matriz completa con fórmulas, metas, línea base, frecuencia y sentidos de medición.</p>
          <button class="btn small" data-action="report-type" data-type="kpis">Generar Reporte →</button>
        </article>
      </div>

      <!-- Área de Vista Previa del Reporte -->
      <section class="panel" style="margin-top:20px;">
        <div class="panel-head">
          <div>
            <h2 id="reportResultTitle">Vista Previa: Reporte General del Balanced Scorecard</h2>
            <p id="reportResultSub">TechPeru SAC · Período Oficial 2025 · Datos consolidados a la fecha</p>
          </div>
          <button class="panel-action" data-action="export-report-csv">Descargar CSV ↓</button>
        </div>

        <div id="reportResult">
          <div class="grid dashboard-grid" style="margin-bottom:18px;">
            <div class="info-box">
              <span class="eyebrow">RESUMEN EJECUTIVO</span>
              <div class="kpi-result" style="margin-top:8px;">
                <div>
                  <small>Índice Global de Cumplimiento BSC</small>
                  <strong>${fmt(globalCompliance())}%</strong>
                </div>
                <span class="status warn">⚠ EN RIESGO</span>
              </div>
              <p style="margin:10px 0 0; font-size:11px;">
                De los 36 indicadores evaluados: <b>11 Logrados (≥90%)</b>, <b>19 En Riesgo (75–89%)</b> y <b>6 Críticos (&lt;75%)</b>.
              </p>
            </div>
            <div class="chart-wrap short">
              <canvas id="reportChart"></canvas>
            </div>
          </div>

          ${renderBscFullTable(state.kpis)}
        </div>
      </section>
    `;
  }

  // -------------------------------------------------------------
  // MÓDULO 9: ADMINISTRACIÓN Y CONFIGURACIÓN
  // -------------------------------------------------------------
  function renderAdministration() {
    return `
      ${pageHead(
        "Administración del Sistema — TechPeru SAC",
        "Control de accesos de demostración, catálogo de áreas, configuración de evaluación y auditoría.",
        `${canAdmin() ? `<button class="btn primary" data-action="new-user">＋ Nuevo usuario demo</button>` : ""}`
      )}

      <div class="grid metric-grid">
        ${metricCard("Usuarios Activos", state.users.length, "Cuentas de demostración", "👤")}
        ${metricCard("Roles de Acceso", "3", "Admin, Gerente, Responsable", "🔒")}
        ${metricCard("Período Activo", state.period, "Año de evaluación 2025", "📅")}
        ${metricCard("Auditoría", state.audit.length, "Acciones registradas en sesión", "📝")}
      </div>

      <div class="grid admin-grid">
        <!-- Usuarios -->
        <section class="panel">
          <div class="panel-head">
            <div>
              <h2>Usuarios y Permisos de Demostración</h2>
              <p>Roles configurados para simular permisos en el BSC</p>
            </div>
          </div>
          <div class="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Área</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${state.users.map(u => `
                  <tr>
                    <td>
                      <strong>${escapeHtml(u.name)}</strong>
                      <span class="subcell">${escapeHtml(u.email)}</span>
                    </td>
                    <td><span class="tag">${escapeHtml(u.role)}</span></td>
                    <td>${escapeHtml(u.area)}</td>
                    <td>
                      ${canAdmin() ? `
                        <div class="table-actions">
                          <button class="text-action" data-action="edit-user" data-id="${u.id}">Editar</button>
                          ${u.id !== 'u1' ? `<button class="text-action" data-action="delete-user" data-id="${u.id}">Eliminar</button>` : ''}
                        </div>
                      ` : "Solo lectura"}
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </section>

        <!-- Configuración y Respaldos -->
        <section class="panel">
          <div class="panel-head">
            <div>
              <h2>Configuración del BSC</h2>
              <p>Parámetros generales de la organización</p>
            </div>
          </div>

          <form id="settingsForm" class="detail-form-grid">
            <div class="field">
              <label for="settingOrg">Organización</label>
              <input id="settingOrg" value="${escapeHtml(state.company || 'TechPeru SAC')}" required>
            </div>
            <div class="field">
              <label for="settingPeriod">Período de Evaluación</label>
              <select id="settingPeriod">
                <option value="2025" ${state.period === '2025' ? 'selected' : ''}>2025 (Oficial)</option>
                <option value="2024" ${state.period === '2024' ? 'selected' : ''}>2024</option>
                <option value="2026" ${state.period === '2026' ? 'selected' : ''}>2026</option>
              </select>
            </div>
            <div class="field full-span">
              <label>Regla de Semáforo Configurada (Excel Oficial)</label>
              <div class="info-box">
                • <b>Logrado (Verde):</b> Cumplimiento ≥ 90.0%<br>
                • <b>En riesgo (Ámbar):</b> Cumplimiento entre 75.0% y 89.9%<br>
                • <b>Crítico (Rojo):</b> Cumplimiento &lt; 75.0%<br>
                • <b>KPIs Inversos:</b> Cumplimiento = (Meta / Real) × 100
              </div>
            </div>
            <div class="field full-span">
              <button class="btn primary" type="submit">Guardar Configuración</button>
            </div>
          </form>

          <div class="info-box" style="margin-top:16px;">
            <strong>Respaldo y Restauración de Datos</strong>
            <p>Descarga el estado completo en formato JSON o restaura la configuración original de TechPeru SAC 2025.</p>
            <div class="head-actions" style="margin-top:8px;">
              <button class="btn small" data-action="backup-json">↓ Exportar JSON</button>
              <button class="btn small danger" data-action="reset-demo">Restaurar Demo Original</button>
            </div>
          </div>
        </section>
      </div>

      <!-- Registro de Auditoría -->
      <section class="panel" style="margin-top:20px;">
        <div class="panel-head">
          <div>
            <h2>Pista de Auditoría del Sistema</h2>
            <p>Últimos eventos registrados en la sesión interactiva</p>
          </div>
        </div>
        <div class="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Fecha y Hora</th>
                <th>Usuario</th>
                <th>Acción</th>
                <th>Entidad</th>
                <th>Detalle del Cambio</th>
              </tr>
            </thead>
            <tbody>
              ${state.audit.slice(0, 15).map(a => `
                <tr>
                  <td><span style="font-size:11px;">${new Date(a.date).toLocaleString("es-PE")}</span></td>
                  <td><b>${escapeHtml(a.user)}</b></td>
                  <td><span class="tag">${escapeHtml(a.action)}</span></td>
                  <td>${escapeHtml(a.entity)}</td>
                  <td>${escapeHtml(a.detail)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </section>
    `;
  }

  // Objeto con todos los renderizadores de páginas
  const renderers = {
    dashboard: renderDashboard,
    "bsc-completo": renderBscCompleto,
    mapa: renderMap,
    objetivos: renderObjectives,
    kpis: renderKpis,
    mediciones: renderMeasurements,
    iniciativas: renderInitiatives,
    reportes: renderReports,
    administracion: renderAdministration
  };

  // -------------------------------------------------------------
  // DIBUJADO DE GRÁFICOS CHART.JS
  // -------------------------------------------------------------
  function chartAvailable() {
    return typeof window.Chart !== "undefined";
  }

  function drawDashboardCharts() {
    if (!chartAvailable()) return;

    // 1. Gráfico de Barras: Desempeño por Perspectiva
    const ctxBars = $("#perspectiveChart");
    if (ctxBars) {
      const per = perspectiveBreakdown();
      charts.perspective = new Chart(ctxBars, {
        type: "bar",
        data: {
          labels: per.map(x => x.label),
          datasets: [{
            label: "Cumplimiento (%)",
            data: per.map(x => x.pct !== null ? Number(x.pct.toFixed(1)) : 0),
            backgroundColor: per.map(x => x.color),
            borderRadius: 6,
            maxBarThickness: 42
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => ` ${ctx.parsed.y}% de cumplimiento`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 110,
              grid: { color: "#f1f5f9" },
              ticks: { callback: v => v + "%", font: { size: 10 } }
            },
            x: {
              grid: { display: false },
              ticks: { font: { size: 10 } }
            }
          }
        }
      });
    }

    // 2. Gráfico de Línea: Tendencia Mensual 2025
    const ctxTrend = $("#trendChart");
    if (ctxTrend) {
      const months = ["2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06"];
      const trendValues = months.map(m => {
        const compliances = state.kpis.map(k => {
          const meas = k.measurements.find(x => x.period === m);
          return meas ? achievement(k, meas.value) : null;
        }).filter(v => v !== null);
        return compliances.length ? Number((compliances.reduce((a, b) => a + b, 0) / compliances.length).toFixed(1)) : null;
      });

      charts.trend = new Chart(ctxTrend, {
        type: "line",
        data: {
          labels: ["Ene 2025", "Feb 2025", "Mar 2025", "Abr 2025", "May 2025", "Jun 2025"],
          datasets: [{
            label: "Cumplimiento Global",
            data: trendValues,
            borderColor: "#1d4ed8",
            backgroundColor: "rgba(29, 78, 216, 0.08)",
            borderWidth: 2.5,
            fill: true,
            tension: 0.35,
            pointBackgroundColor: "#1d4ed8",
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => ` Cumplimiento: ${ctx.parsed.y}%`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              min: 60,
              max: 100,
              grid: { color: "#f1f5f9" },
              ticks: { callback: v => v + "%", font: { size: 10 } }
            },
            x: {
              grid: { display: false },
              ticks: { font: { size: 10 } }
            }
          }
        }
      });
    }
  }

  function drawReportCharts() {
    if (!chartAvailable()) return;
    const ctx = $("#reportChart");
    if (!ctx) return;

    const good = state.kpis.filter(k => statusOf(k).key === "good").length;
    const warn = state.kpis.filter(k => statusOf(k).key === "warn").length;
    const bad = state.kpis.filter(k => statusOf(k).key === "bad").length;

    charts.report = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Logrado (≥90%)", "En riesgo (75–89%)", "Crítico (<75%)"],
        datasets: [{
          data: [good, warn, bad],
          backgroundColor: ["#059669", "#d97706", "#dc2626"],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: { font: { size: 11 }, boxWidth: 12 }
          }
        }
      }
    });
  }

  // -------------------------------------------------------------
  // EVENTOS Y FILTROS EN TIEMPO REAL
  // -------------------------------------------------------------
  function bindPageEvents(page) {
    const root = $("#pageContent");

    root.onclick = e => {
      const b = e.target.closest("[data-action]");
      if (!b) return;
      handleAction(b.dataset.action, b.dataset.id, b.dataset);
    };

    root.oninput = e => {
      if (["objSearch", "kpiSearch", "measurementSearch", "initiativeSearch", "bscSearch"].includes(e.target.id)) {
        applyFilters(page);
      }
    };

    root.onchange = e => {
      if (["objPerspective", "objStatus", "objPriority", "kpiPerspective", "kpiOwner", "kpiStatus", "measurementKpi", "measurementMonth", "initiativeStatus", "initiativeOwner", "bscStatusFilter", "bscDirectionFilter"].includes(e.target.id)) {
        applyFilters(page);
      }
    };

    // Pestañas de perspectiva en el módulo BSC Completo
    const bscTabs = $("#bscPerspectiveTabs");
    if (bscTabs) {
      bscTabs.onclick = e => {
        const tab = e.target.closest(".tab-btn");
        if (!tab) return;
        $$(".tab-btn", bscTabs).forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        applyFilters("bsc-completo");
      };
    }

    // Formulario de configuración en Administración
    const sf = $("#settingsForm");
    if (sf) {
      sf.onsubmit = e => {
        e.preventDefault();
        state.company = $("#settingOrg").value.trim();
        state.period = $("#settingPeriod").value;
        saveState();
        recordAudit("Configuración", "Evaluación", `Se actualizó la configuración: ${state.company} (${state.period}).`);
        toast("Configuración guardada correctamente");
        renderPage("administracion");
      };
    }
  }

  function applyFilters(page) {
    if (page === "bsc-completo") {
      const activeTab = $("#bscPerspectiveTabs .tab-btn.active")?.dataset.persp || "todas";
      const q = ($("#bscSearch")?.value || "").toLowerCase();
      const statusFilter = $("#bscStatusFilter")?.value || "";
      const dirFilter = $("#bscDirectionFilter")?.value || "";

      const items = state.kpis.filter(k => {
        const matchesTab = activeTab === "todas" || k.perspective === activeTab;
        const matchesSearch = !q || `${k.id} ${k.name} ${k.formula} ${k.recommendation || ''}`.toLowerCase().includes(q);
        const matchesStatus = !statusFilter || statusOf(k).key === statusFilter;
        const matchesDir = !dirFilter || k.direction === dirFilter;
        return matchesTab && matchesSearch && matchesStatus && matchesDir;
      });

      $("#bscTableContainer").innerHTML = renderBscFullTable(items);
    }

    if (page === "objetivos") {
      const q = ($("#objSearch")?.value || "").toLowerCase();
      const p = $("#objPerspective")?.value || "";
      const s = $("#objStatus")?.value || "";
      const pr = $("#objPriority")?.value || "";

      const items = state.objectives.filter(o => {
        return (!q || `${o.id} ${o.name} ${o.owner}`.toLowerCase().includes(q)) &&
               (!p || o.perspective === p) &&
               (!s || o.status === s) &&
               (!pr || o.priority === pr);
      });
      $("#objectiveTableWrap").innerHTML = objectivesTable(items);
    }

    if (page === "kpis") {
      const q = ($("#kpiSearch")?.value || "").toLowerCase();
      const p = $("#kpiPerspective")?.value || "";
      const owner = $("#kpiOwner")?.value || "";
      const st = $("#kpiStatus")?.value || "";

      const items = state.kpis.filter(k => {
        return (!q || `${k.id} ${k.name} ${k.formula}`.toLowerCase().includes(q)) &&
               (!p || k.perspective === p) &&
               (!owner || k.owner === owner) &&
               (!st || statusOf(k).key === st);
      });
      $("#kpiTableWrap").innerHTML = kpisFullTable(items);
    }

    if (page === "mediciones") {
      const q = ($("#measurementSearch")?.value || "").toLowerCase();
      const kid = $("#measurementKpi")?.value || "";
      const month = $("#measurementMonth")?.value || "";

      const items = state.kpis.flatMap(k => k.measurements.map(m => ({ ...m, kpi: k }))).filter(x => {
        return (!q || `${x.kpi.name} ${x.kpi.owner} ${x.notes}`.toLowerCase().includes(q)) &&
               (!kid || x.kpi.id === kid) &&
               (!month || x.period === month);
      }).sort((a, b) => b.date.localeCompare(a.date));

      $("#measurementTableWrap").innerHTML = measurementTable(items);
    }

    if (page === "iniciativas") {
      const q = ($("#initiativeSearch")?.value || "").toLowerCase();
      const st = $("#initiativeStatus")?.value || "";
      const owner = $("#initiativeOwner")?.value || "";

      const items = state.initiatives.filter(i => {
        return (!q || `${i.id} ${i.name} ${objectiveName(i.objectiveId)}`.toLowerCase().includes(q)) &&
               (!st || i.status === st) &&
               (!owner || i.owner === owner);
      });
      $("#initiativeTableWrap").innerHTML = initiativesTable(items);
    }
  }

  // -------------------------------------------------------------
  // ACCIONES Y ENLACES
  // -------------------------------------------------------------
  function handleAction(action, id, data = {}) {
    switch (action) {
      case "go-bsc-completo": navigate("bsc-completo"); break;
      case "go-mediciones": navigate("mediciones"); break;
      case "go-kpis": navigate("kpis"); break;
      case "go-reportes": navigate("reportes"); break;

      case "new-objective": openObjectiveForm(); break;
      case "edit-objective": openObjectiveForm(id); break;
      case "delete-objective": confirmDelete("objetivo", id); break;
      case "objective-detail": showObjectiveDetail(id); break;

      case "new-kpi": openKpiForm(); break;
      case "edit-kpi": openKpiForm(id); break;
      case "delete-kpi": confirmDelete("KPI", id); break;
      case "kpi-detail": showKpiDetail(id); break;
      case "measure-kpi": openMeasurementForm(null, id); break;

      case "new-measurement": openMeasurementForm(); break;
      case "edit-measurement": openMeasurementForm(id, data.kpi); break;
      case "export-measurements": exportMeasurements(); break;

      case "new-initiative": openInitiativeForm(); break;
      case "edit-initiative": openInitiativeForm(id); break;
      case "delete-initiative": confirmDelete("iniciativa", id); break;
      case "initiative-detail": showInitiativeDetail(id); break;

      case "new-user": openUserForm(); break;
      case "edit-user": openUserForm(id); break;
      case "delete-user": confirmDelete("usuario", id); break;

      case "report-type": generateReport(data.type); break;
      case "export-bsc-csv": exportBscCSV(); break;
      case "export-report-csv": exportCurrentReport(); break;
      case "print-report": window.print(); break;

      case "backup-json":
        downloadBlob("TechPeru_BSC_Respaldo_2025.json", JSON.stringify(state, null, 2), "application/json");
        toast("Respaldo JSON descargado correctamente");
        break;

      case "reset-demo": confirmReset(); break;
    }
  }

  // -------------------------------------------------------------
  // MODALES Y FORMULARIOS CRUD
  // -------------------------------------------------------------
  function showModal(title, body, submitLabel = "Guardar", submitFn = null, eyebrow = "GESTIÓN") {
    $("#modalTitle").textContent = title;
    $("#modalEyebrow").textContent = eyebrow;
    $("#modalBody").innerHTML = body;
    $("#modalFooter").innerHTML = `
      <button class="btn" type="button" id="modalCancel">Cancelar</button>
      <button class="btn primary" type="button" id="modalSubmit">${submitLabel}</button>
    `;
    $("#modalLayer").classList.remove("hidden");
    modalSubmit = submitFn;
    $("#modalClose").onclick = closeModal;
    $("#modalCancel").onclick = closeModal;
    $("#modalSubmit").onclick = () => { if (modalSubmit) modalSubmit(); };
    $("#modalLayer").onclick = e => { if (e.target === $("#modalLayer")) closeModal(); };
  }

  function closeModal() {
    $("#modalLayer").classList.add("hidden");
    modalSubmit = null;
  }

  function optionsPerspectives(selected) {
    return Object.entries(perspectives).map(([k, p]) => `
      <option value="${k}" ${selected === k ? "selected" : ""}>${p.icon} ${p.label}</option>
    `).join("");
  }

  function objectiveOptions(selected) {
    return `<option value="">Seleccionar objetivo estratégico</option>` +
      state.objectives.map(o => `<option value="${o.id}" ${selected === o.id ? "selected" : ""}>${escapeHtml(o.id + " · " + o.name)}</option>`).join("");
  }

  function userOptions(selected) {
    return [...new Set(state.users.map(u => u.name))].map(n => `
      <option value="${escapeHtml(n)}" ${selected === n ? "selected" : ""}>${escapeHtml(n)}</option>
    `).join("");
  }

  function field(label, name, value = "", type = "text", required = true, extra = "") {
    return `
      <div class="field">
        <label for="${name}">${label}${required ? " *" : ""}</label>
        <input id="${name}" name="${name}" type="${type}" value="${escapeHtml(value)}" ${required ? "required" : ""} ${extra}>
      </div>
    `;
  }

  function selectField(label, name, opts, required = true) {
    return `
      <div class="field">
        <label for="${name}">${label}${required ? " *" : ""}</label>
        <select id="${name}" name="${name}" ${required ? "required" : ""}>${opts}</select>
      </div>
    `;
  }

  function validateForm(ids) {
    for (const id of ids) {
      const el = $("#" + id);
      if (el && el.required && !String(el.value).trim()) {
        el.focus();
        toast("Completa todos los campos obligatorios.", "error");
        return false;
      }
      if (el && el.type === "number" && el.value !== "" && !Number.isFinite(Number(el.value))) {
        el.focus();
        toast("Ingresa un valor numérico válido.", "error");
        return false;
      }
    }
    return true;
  }

  // FORMULARIO: OBJETIVO ESTRATÉGICO
  function openObjectiveForm(id = null) {
    if (!canEdit()) {
      toast("Tu rol no permite modificar objetivos estratégicos.", "error");
      return;
    }
    const o = state.objectives.find(x => x.id === id) || {
      id: "",
      name: "",
      perspective: "financiera",
      description: "",
      owner: currentUser.name,
      priority: "Alta",
      weight: 35,
      status: "Activo"
    };
    const editing = !!id;

    const body = `
      <form id="objectiveForm" class="detail-form-grid">
        <div class="field full-span">
          <label for="oName">Nombre del Objetivo Estratégico *</label>
          <input id="oName" required maxlength="140" value="${escapeHtml(o.name)}">
        </div>
        ${selectField("Perspectiva del BSC", "oPerspective", optionsPerspectives(o.perspective))}
        ${selectField("Responsable", "oOwner", userOptions(o.owner))}
        <div class="field full-span">
          <label for="oDescription">Descripción Estratégica</label>
          <textarea id="oDescription">${escapeHtml(o.description)}</textarea>
        </div>
        ${selectField("Prioridad", "oPriority", ["Alta", "Media", "Baja"].map(x => `<option ${o.priority === x ? 'selected' : ''}>${x}</option>`).join(""))}
        ${field("Ponderación (%)", "oWeight", o.weight, "number", true, 'min="1" max="100"')}
        ${selectField("Estado", "oStatus", ["Activo", "En revisión", "Inactivo"].map(x => `<option ${o.status === x ? 'selected' : ''}>${x}</option>`).join(""))}
      </form>
    `;

    showModal(
      editing ? `Editar Objetivo: ${o.id}` : "Nuevo Objetivo Estratégico",
      body,
      editing ? "Guardar Cambios" : "Crear Objetivo",
      () => {
        if (!validateForm(["oName", "oPerspective", "oWeight"])) return;
        const name = $("#oName").value.trim();
        const weight = Number($("#oWeight").value);

        const payload = {
          name,
          perspective: $("#oPerspective").value,
          description: $("#oDescription").value.trim(),
          owner: $("#oOwner").value,
          priority: $("#oPriority").value,
          weight,
          status: $("#oStatus").value
        };

        if (editing) {
          Object.assign(o, payload);
          recordAudit("Edición", "Objetivo", `${o.id}: ${name}`);
        } else {
          const count = state.objectives.length + 1;
          const codePersp = perspectives[payload.perspective].code[0];
          const newid = `OBJ-${codePersp}${count}`;
          state.objectives.push({ id: newid, ...payload, created: today() });
          recordAudit("Creación", "Objetivo", `${newid}: ${name}`);
        }

        saveState();
        closeModal();
        renderPage(currentPage);
        toast(editing ? "Objetivo actualizado" : "Objetivo creado correctamente");
      }
    );
  }

  // FORMULARIO: KPI
  function openKpiForm(id = null) {
    if (!canEdit()) {
      toast("Tu rol no permite modificar indicadores.", "error");
      return;
    }
    const k = state.kpis.find(x => x.id === id) || {
      id: "",
      name: "",
      perspective: "financiera",
      objectiveId: state.objectives[0]?.id || "",
      unit: "%",
      formula: "",
      baseline: 0,
      target: 100,
      current: null,
      direction: "mayor",
      frequency: "Mensual",
      owner: currentUser.name,
      area: currentUser.area || "General",
      weight: 1,
      recommendation: "",
      description: "",
      alertAt: 75,
      criticalAt: 75,
      targetAt: 90,
      lower: null,
      upper: null,
      measurements: []
    };
    const editing = !!id;

    const body = `
      <form id="kpiForm" class="detail-form-grid">
        <div class="field full-span">
          <label for="kName">Nombre del Indicador (KPI) *</label>
          <input id="kName" required value="${escapeHtml(k.name)}">
        </div>
        ${selectField("Perspectiva", "kPerspective", optionsPerspectives(k.perspective))}
        ${selectField("Objetivo Estratégico Asociado", "kObjective", objectiveOptions(k.objectiveId))}
        ${field("Unidad de Medida", "kUnit", k.unit, "text", true)}
        ${selectField("Sentido de Medición", "kDirection", `
          <option value="mayor" ${k.direction === 'mayor' ? 'selected' : ''}>Mayor es mejor (Directo)</option>
          <option value="menor" ${k.direction === 'menor' ? 'selected' : ''}>Menor es mejor (Inverso: Meta / Real × 100)</option>
        `)}
        <div class="field full-span">
          <label for="kFormula">Fórmula de Cálculo *</label>
          <input id="kFormula" required value="${escapeHtml(k.formula)}">
        </div>
        ${field("Línea Base", "kBaseline", k.baseline, "number", true, 'step="any"')}
        ${field("Meta Anual", "kTarget", k.target, "number", true, 'step="any"')}
        ${field("Resultado Actual", "kCurrent", k.current ?? "", "number", false, 'step="any"')}
        ${selectField("Frecuencia", "kFrequency", ["Mensual", "Trimestral", "Semestral", "Anual"].map(x => `<option ${k.frequency === x ? 'selected' : ''}>${x}</option>`).join(""))}
        ${selectField("Responsable", "kOwner", userOptions(k.owner))}
        ${field("Área Organizacional", "kArea", k.area, "text", true)}
        <div class="field full-span">
          <label for="kRecommendation">Análisis / Acción Recomendada</label>
          <textarea id="kRecommendation">${escapeHtml(k.recommendation || "")}</textarea>
        </div>
      </form>
    `;

    showModal(
      editing ? `Editar KPI: ${k.id}` : "Nuevo Indicador KPI",
      body,
      editing ? "Guardar Cambios" : "Crear Indicador",
      () => {
        if (!validateForm(["kName", "kPerspective", "kObjective", "kUnit", "kFormula", "kBaseline", "kTarget"])) return;
        const target = Number($("#kTarget").value);
        const direction = $("#kDirection").value;

        if (target === 0 && direction === "menor") {
          toast("Para indicadores de 'Menor es mejor', la meta debe ser distinta de cero.", "error");
          return;
        }

        const currentVal = $("#kCurrent").value === "" ? null : Number($("#kCurrent").value);
        const payload = {
          name: $("#kName").value.trim(),
          perspective: $("#kPerspective").value,
          objectiveId: $("#kObjective").value,
          unit: $("#kUnit").value.trim(),
          formula: $("#kFormula").value.trim(),
          baseline: Number($("#kBaseline").value),
          target,
          current: currentVal,
          direction,
          frequency: $("#kFrequency").value,
          owner: $("#kOwner").value,
          area: $("#kArea").value.trim(),
          recommendation: $("#kRecommendation").value.trim()
        };

        if (editing) {
          Object.assign(k, payload);
          recordAudit("Edición", "KPI", `${k.id}: ${k.name}`);
        } else {
          const codePersp = perspectives[payload.perspective].code[0];
          const newid = `KPI-${codePersp}${String(state.kpis.length + 1).padStart(2, "0")}`;
          state.kpis.push({
            id: newid,
            ...payload,
            weight: 1,
            alertAt: 75,
            criticalAt: 75,
            targetAt: 90,
            description: payload.recommendation,
            measurements: []
          });
          recordAudit("Creación", "KPI", `${newid}: ${payload.name}`);
        }

        saveState();
        updateCriticalBadge();
        closeModal();
        renderPage(currentPage);
        toast(editing ? "Indicador actualizado" : "Indicador creado con éxito");
      }
    );
  }

  // FORMULARIO: REGISTRO DE RESULTADOS (MEDICIÓN)
  function openMeasurementForm(measureId = null, kpiId = null) {
    const k = state.kpis.find(x => x.id === kpiId) || state.kpis[0];
    if (!k) {
      toast("No hay indicadores disponibles.", "error");
      return;
    }

    let existing = null;
    let chosenKpi = k;
    if (measureId) {
      for (const item of state.kpis) {
        existing = item.measurements.find(m => m.id === measureId);
        if (existing) {
          chosenKpi = item;
          break;
        }
      }
    }

    const m = existing || {
      period: monthNow(),
      date: today(),
      value: chosenKpi.current ?? chosenKpi.target,
      notes: "",
      responsible: chosenKpi.owner
    };

    const body = `
      <form id="measurementForm" class="detail-form-grid">
        <div class="field full-span">
          <label for="mKpi">Indicador KPI *</label>
          <select id="mKpi" required>
            ${state.kpis.map(x => `<option value="${x.id}" ${x.id === chosenKpi.id ? 'selected' : ''}>${x.id} · ${escapeHtml(x.name)} (${escapeHtml(x.unit)})</option>`).join("")}
          </select>
        </div>
        ${field("Período de Evaluación", "mPeriod", m.period, "month", true)}
        ${field("Fecha de Medición", "mDate", m.date, "date", true)}
        <div class="field" id="mValueWrap">
          <label for="mValue">Valor Obtenido (${escapeHtml(chosenKpi.unit)}) *</label>
          <input id="mValue" type="number" step="any" required value="${m.value}">
        </div>
        ${selectField("Responsable del Registro", "mOwner", userOptions(m.responsible || chosenKpi.owner))}
        <div class="field full-span">
          <label for="mNotes">Observaciones / Justificación de la Desviación</label>
          <textarea id="mNotes" placeholder="Indica detalles sobre el resultado o acciones correctivas aplicadas…">${escapeHtml(m.notes)}</textarea>
        </div>
        <div class="field full-span">
          <div class="info-box">
            • <b>Meta del KPI:</b> ${fmt(chosenKpi.target, 1)} ${escapeHtml(chosenKpi.unit)}<br>
            • <b>Sentido:</b> ${chosenKpi.direction === 'menor' ? 'Menor es mejor (Meta / Real × 100)' : 'Mayor es mejor (Real / Meta × 100)'}<br>
            • Al guardar, el valor actual del KPI y el semáforo se recalculan automáticamente en todo el sistema.
          </div>
        </div>
      </form>
    `;

    showModal(
      existing ? "Editar Medición" : "Registrar Resultado Real",
      body,
      existing ? "Guardar Cambios" : "Guardar Medición",
      () => {
        if (!validateForm(["mKpi", "mPeriod", "mDate", "mValue", "mOwner"])) return;
        const targetKpi = state.kpis.find(x => x.id === $("#mKpi").value);
        const val = Number($("#mValue").value);

        if (!Number.isFinite(val)) {
          toast("El valor de la medición debe ser numérico.", "error");
          return;
        }

        const payload = {
          period: $("#mPeriod").value,
          date: $("#mDate").value,
          value: val,
          notes: $("#mNotes").value.trim(),
          responsible: $("#mOwner").value
        };

        if (existing && targetKpi === chosenKpi) {
          Object.assign(existing, payload);
        } else {
          if (existing) {
            chosenKpi.measurements = chosenKpi.measurements.filter(x => x.id !== existing.id);
          }
          const newid = `M-${targetKpi.id}-${Date.now()}`;
          targetKpi.measurements.push({ id: newid, ...payload });
        }

        // Ordenar mediciones por período/fecha y actualizar el valor actual del KPI
        targetKpi.measurements.sort((a, b) => a.period.localeCompare(b.period) || a.date.localeCompare(b.date));
        const latest = targetKpi.measurements[targetKpi.measurements.length - 1];
        targetKpi.current = latest ? latest.value : null;

        recordAudit(existing ? "Edición" : "Registro", "Medición", `${targetKpi.id}: ${val} ${targetKpi.unit} (${payload.period})`);
        saveState();
        updateCriticalBadge();
        closeModal();
        renderPage(currentPage);
        toast(existing ? "Medición actualizada" : "Resultado guardado y semáforo recalculado");
      }
    );

    $("#mKpi")?.addEventListener("change", () => {
      const kk = state.kpis.find(x => x.id === $("#mKpi").value);
      if (kk) {
        $("#mValueWrap label").textContent = `Valor Obtenido (${kk.unit}) *`;
        $("#mOwner").value = kk.owner;
      }
    });
  }

  // FORMULARIO: INICIATIVA ESTRATÉGICA
  function openInitiativeForm(id = null) {
    if (!canEdit()) {
      toast("Tu rol no permite modificar iniciativas.", "error");
      return;
    }
    const i = state.initiatives.find(x => x.id === id) || {
      id: "",
      name: "",
      objectiveId: state.objectives[0]?.id || "",
      kpiId: state.kpis[0]?.id || "",
      owner: currentUser.name,
      area: currentUser.area || "Operaciones",
      start: "2025-01-01",
      end: "2025-12-31",
      budget: 30000,
      progress: 0,
      status: "Planificada",
      description: ""
    };
    const editing = !!id;

    const body = `
      <form id="initiativeForm" class="detail-form-grid">
        <div class="field full-span">
          <label for="iName">Nombre de la Iniciativa Estratégica *</label>
          <input id="iName" required value="${escapeHtml(i.name)}">
        </div>
        ${selectField("Objetivo Estratégico Vinculado", "iObjective", objectiveOptions(i.objectiveId))}
        ${selectField("KPI Relacionado", "iKpi", `<option value="">Sin KPI asociado</option>` + state.kpis.map(k => `<option value="${k.id}" ${i.kpiId === k.id ? 'selected' : ''}>${k.id} · ${escapeHtml(k.name)}</option>`).join(""))}
        ${selectField("Responsable del Proyecto", "iOwner", userOptions(i.owner))}
        ${field("Área Responsable", "iArea", i.area, "text", true)}
        ${field("Fecha de Inicio", "iStart", i.start, "date", true)}
        ${field("Fecha de Fin", "iEnd", i.end, "date", true)}
        ${field("Presupuesto Asignado (S/)", "iBudget", i.budget, "number", true, 'min="0" step="any"')}
        ${field("Porcentaje de Avance (%)", "iProgress", i.progress, "number", true, 'min="0" max="100" step="1"')}
        ${selectField("Estado", "iStatus", ["Planificada", "En ejecución", "En riesgo", "Finalizada"].map(x => `<option ${i.status === x ? 'selected' : ''}>${x}</option>`).join(""))}
        <div class="field full-span">
          <label for="iDescription">Descripción y Entregables Clave</label>
          <textarea id="iDescription">${escapeHtml(i.description)}</textarea>
        </div>
      </form>
    `;

    showModal(
      editing ? `Editar Iniciativa: ${i.id}` : "Nueva Iniciativa Estratégica",
      body,
      editing ? "Guardar Cambios" : "Crear Iniciativa",
      () => {
        if (!validateForm(["iName", "iObjective", "iOwner", "iArea", "iStart", "iEnd", "iBudget", "iProgress", "iStatus"])) return;
        const progress = Number($("#iProgress").value);
        const budget = Number($("#iBudget").value);
        const start = $("#iStart").value;
        const end = $("#iEnd").value;

        if (end < start) {
          toast("La fecha de fin debe ser igual o posterior a la fecha de inicio.", "error");
          return;
        }

        const payload = {
          name: $("#iName").value.trim(),
          objectiveId: $("#iObjective").value,
          kpiId: $("#iKpi").value,
          owner: $("#iOwner").value,
          area: $("#iArea").value.trim(),
          start,
          end,
          budget,
          progress,
          status: progress === 100 ? "Finalizada" : $("#iStatus").value,
          description: $("#iDescription").value.trim()
        };

        if (editing) {
          Object.assign(i, payload);
          recordAudit("Edición", "Iniciativa", `${i.id}: ${i.name}`);
        } else {
          const newid = `INI-${String(state.initiatives.length + 1).padStart(2, "0")}`;
          state.initiatives.push({ id: newid, ...payload });
          recordAudit("Creación", "Iniciativa", `${newid}: ${payload.name}`);
        }

        saveState();
        closeModal();
        renderPage(currentPage);
        toast(editing ? "Iniciativa actualizada" : "Iniciativa creada");
      }
    );
  }

  // FORMULARIO: USUARIO DEMO
  function openUserForm(id = null) {
    if (!canAdmin()) {
      toast("Solo el Administrador puede gestionar cuentas de usuario.", "error");
      return;
    }
    const u = state.users.find(x => x.id === id) || {
      id: "",
      name: "",
      email: "",
      role: "Responsable de indicadores",
      area: "Operaciones"
    };
    const editing = !!id;

    const body = `
      <form id="userForm" class="detail-form-grid">
        ${field("Nombre Completo", "uName", u.name, "text", true)}
        ${field("Correo Electrónico Demo", "uEmail", u.email, "email", true)}
        ${selectField("Rol de Demostración", "uRole", ["Administrador", "Gerente", "Responsable de indicadores"].map(x => `<option ${u.role === x ? 'selected' : ''}>${x}</option>`).join(""))}
        ${field("Área / Departamento", "uArea", u.area, "text", true)}
        <div class="field full-span">
          <div class="info-box">
            Contraseña predeterminada de demostración: <b>BSC2026!</b>
          </div>
        </div>
      </form>
    `;

    showModal(
      editing ? "Editar Usuario Demo" : "Nuevo Usuario Demo",
      body,
      editing ? "Guardar Cambios" : "Crear Usuario",
      () => {
        if (!validateForm(["uName", "uEmail", "uRole", "uArea"])) return;
        const email = $("#uEmail").value.trim().toLowerCase();
        if (state.users.some(x => x.email.toLowerCase() === email && x.id !== id)) {
          toast("Ya existe un usuario con ese correo electrónico.", "error");
          return;
        }

        const payload = {
          name: $("#uName").value.trim(),
          email,
          role: $("#uRole").value,
          area: $("#uArea").value.trim()
        };

        if (editing) {
          Object.assign(u, payload);
          recordAudit("Edición", "Usuario", payload.email);
        } else {
          const newid = "u" + Date.now();
          state.users.push({ id: newid, ...payload, password: "BSC2026!" });
          recordAudit("Creación", "Usuario", payload.email);
        }

        saveState();
        closeModal();
        renderPage(currentPage);
        toast(editing ? "Usuario actualizado" : "Usuario demo registrado");
      }
    );
  }

  // CONFIRMACIÓN DE ELIMINACIÓN
  function confirmDelete(type, id) {
    if (!canEdit() && type !== "usuario") {
      toast("Tu rol no permite eliminar registros.", "error");
      return;
    }
    if (type === "usuario" && !canAdmin()) {
      toast("Solo el Administrador puede eliminar usuarios.", "error");
      return;
    }

    let entity = type === "objetivo" ? state.objectives.find(x => x.id === id) :
                 type === "KPI" ? state.kpis.find(x => x.id === id) :
                 type === "iniciativa" ? state.initiatives.find(x => x.id === id) :
                 state.users.find(x => x.id === id);

    if (!entity) return;

    showModal(
      "Confirmar Eliminación",
      `
        <div class="info-box">
          <strong>¿Estás seguro de eliminar el ${escapeHtml(type)} “${escapeHtml(entity.name || entity.email)}”?</strong>
          <p style="margin:8px 0 0; color:var(--red);">Esta acción removerá el registro del modelo del Balanced Scorecard.</p>
        </div>
      `,
      "Sí, Eliminar",
      () => {
        if (type === "objetivo") {
          state.objectives = state.objectives.filter(x => x.id !== id);
          state.kpis.forEach(k => { if (k.objectiveId === id) k.objectiveId = ""; });
          state.initiatives.forEach(i => { if (i.objectiveId === id) i.objectiveId = ""; });
        }
        if (type === "KPI") {
          state.kpis = state.kpis.filter(x => x.id !== id);
          state.initiatives.forEach(i => { if (i.kpiId === id) i.kpiId = ""; });
        }
        if (type === "iniciativa") {
          state.initiatives = state.initiatives.filter(x => x.id !== id);
        }
        if (type === "usuario") {
          if (id === "u1") {
            toast("No es posible eliminar la cuenta del Administrador principal.", "error");
            return;
          }
          state.users = state.users.filter(x => x.id !== id);
        }

        recordAudit("Eliminación", type, `${id}: ${entity.name || entity.email}`);
        saveState();
        updateCriticalBadge();
        closeModal();
        renderPage(currentPage);
        toast("Registro eliminado con éxito");
      },
      "CONFIRMACIÓN"
    );
  }

  // DETALLES Y FICHAS TÉCNICAS
  function showObjectiveDetail(id) {
    const o = state.objectives.find(x => x.id === id);
    if (!o) return;

    const ks = state.kpis.filter(k => k.objectiveId === id);
    const inits = state.initiatives.filter(i => i.objectiveId === id);
    const valid = ks.map(k => achievement(k)).filter(p => p !== null);
    const avg = valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : null;
    const p = perspectives[o.perspective];

    const body = `
      <div class="grid" style="gap:16px;">
        <div class="info-box">
          <span class="tag" style="background:${p.soft}; color:${p.color}; font-weight:800; margin-bottom:6px;">
            ${p.icon} ${p.label}
          </span>
          <h3 style="margin:6px 0; font-size:16px;">${escapeHtml(o.name)}</h3>
          <p style="margin:0 0 10px; color:#475569;">${escapeHtml(o.description)}</p>
          <div style="font-size:11px; color:#64748b; line-height:1.6;">
            <b>Responsable:</b> ${escapeHtml(o.owner)} · <b>Prioridad:</b> ${escapeHtml(o.priority)} · <b>Ponderación:</b> ${o.weight}%
          </div>
        </div>

        <div class="kpi-result">
          <div>
            <small>Cumplimiento Promedio de los KPIs Vinculados</small>
            <strong>${avg !== null ? fmt(avg) + "%" : "—"}</strong>
          </div>
          <span class="status ${avg >= 90 ? 'good' : avg >= 75 ? 'warn' : 'bad'}">
            ${avg >= 90 ? '✅ LOGRADO' : avg >= 75 ? '⚠ EN RIESGO' : '❌ CRÍTICO'}
          </span>
        </div>

        <h3 style="margin:10px 0 0; font-size:14px;">Indicadores Asociados (${ks.length})</h3>
        ${renderKpiTable(ks, false)}

        <h3 style="margin:14px 0 0; font-size:14px;">Iniciativas Estratégicas en Ejecución (${inits.length})</h3>
        ${inits.map(i => `
          <div style="padding:10px 14px; border:1px solid var(--line); border-radius:var(--radius); margin-bottom:6px; background:#fff;">
            <strong>${escapeHtml(i.name)}</strong>
            <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--muted); margin-top:4px;">
              <span>Responsable: ${escapeHtml(i.owner)}</span>
              <span>Avance: <b>${i.progress}%</b> · ${i.status}</span>
            </div>
          </div>
        `).join("") || `<p class="muted" style="font-size:12px;">No hay iniciativas asignadas a este objetivo.</p>`}
      </div>
    `;

    showModal(`${o.id} · Detalle del Objetivo Estratégico`, body, "Cerrar", closeModal, "OBJETIVO BSC");
  }

  function showKpiDetail(id) {
    const k = state.kpis.find(x => x.id === id);
    if (!k) return;

    const s = statusOf(k);
    const p = perspectives[k.perspective];
    const obj = state.objectives.find(o => o.id === k.objectiveId);

    const body = `
      <div class="grid" style="gap:16px;">
        <div class="info-box">
          <span class="tag" style="background:${p.soft}; color:${p.color}; font-weight:800;">
            ${p.icon} ${p.label}
          </span>
          <h3 style="margin:8px 0 4px; font-size:16px;">${escapeHtml(k.name)} (${k.id})</h3>
          <p style="margin:0 0 10px; color:#64748b; font-size:12px;">Objetivo: <b>${escapeHtml(obj?.name || "Sin objetivo")}</b></p>
          
          <div class="kpi-result" style="margin-top:12px;">
            <div>
              <small>Resultado Real Acumulado</small>
              <strong>${fmt(k.current, 1)} <span style="font-size:16px;">${escapeHtml(k.unit)}</span></strong>
            </div>
            <div>
              ${statusBadge(k)}
              <small style="text-align:right; margin-top:4px;">Meta: <b>${fmt(k.target, 1)} ${escapeHtml(k.unit)}</b></small>
            </div>
          </div>
        </div>

        <div class="action-recommendation-box">
          <strong>Análisis y Recomendación Estratégica (Excel 2025):</strong>
          ${escapeHtml(k.recommendation || k.description)}
        </div>

        <div class="panel" style="padding:14px; box-shadow:none;">
          <h4 style="margin:0 0 8px; font-size:12px;">Ficha Técnica</h4>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:11px; line-height:1.5;">
            <div><b>Fórmula:</b> ${escapeHtml(k.formula)}</div>
            <div><b>Sentido:</b> ${k.direction === 'menor' ? 'Menor es mejor (Meta / Real × 100)' : 'Mayor es mejor (Real / Meta × 100)'}</div>
            <div><b>Línea Base:</b> ${fmt(k.baseline, 1)} ${escapeHtml(k.unit)}</div>
            <div><b>Frecuencia:</b> ${escapeHtml(k.frequency)}</div>
            <div><b>Responsable:</b> ${escapeHtml(k.owner)}</div>
            <div><b>Área:</b> ${escapeHtml(k.area)}</div>
          </div>
        </div>

        <div class="panel" style="padding:14px; box-shadow:none;">
          <h4 style="margin:0 0 10px; font-size:12px;">Evolución de Mediciones 2025</h4>
          <div class="chart-wrap short">
            <canvas id="kpiHistoryChart"></canvas>
          </div>
        </div>
      </div>
    `;

    showModal(`Ficha Técnica de KPI: ${k.id}`, body, "Registrar Medición", () => {
      closeModal();
      openMeasurementForm(null, id);
    }, "DETALLE KPI");

    // Dibujar gráfico de historial en el modal
    if (chartAvailable()) {
      setTimeout(() => {
        const ctx = $("#kpiHistoryChart");
        if (ctx) {
          const sorted = [...k.measurements].sort((a, b) => a.period.localeCompare(b.period));
          charts.modal = new Chart(ctx, {
            type: "line",
            data: {
              labels: sorted.map(m => m.period),
              datasets: [
                {
                  label: "Real Obtenido",
                  data: sorted.map(m => m.value),
                  borderColor: "#1d4ed8",
                  backgroundColor: "rgba(29, 78, 216, 0.1)",
                  borderWidth: 2,
                  fill: true,
                  tension: 0.3
                },
                {
                  label: "Meta Anual",
                  data: sorted.map(() => k.target),
                  borderColor: "#dc2626",
                  borderDash: [5, 5],
                  borderWidth: 1.5,
                  fill: false,
                  pointRadius: 0
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: { grid: { color: "#f1f5f9" }, ticks: { font: { size: 9 } } },
                x: { grid: { display: false }, ticks: { font: { size: 9 } } }
              }
            }
          });
        }
      }, 50);
    }
  }

  function showInitiativeDetail(id) {
    const i = state.initiatives.find(x => x.id === id);
    if (!i) return;
    const k = state.kpis.find(x => x.id === i.kpiId);

    const body = `
      <div class="grid" style="gap:14px;">
        <div class="info-box">
          <h3 style="margin:0 0 6px; font-size:16px;">${escapeHtml(i.name)}</h3>
          <p style="margin:0 0 10px; color:#475569; font-size:12px;">${escapeHtml(i.description)}</p>
          <div style="font-size:11px; line-height:1.6; color:#64748b;">
            <b>Objetivo:</b> ${escapeHtml(objectiveName(i.objectiveId))}<br>
            <b>KPI Relacionado:</b> ${k ? `${k.id} · ${k.name}` : "Ninguno"}<br>
            <b>Responsable:</b> ${escapeHtml(i.owner)} (${escapeHtml(i.area)})<br>
            <b>Fechas:</b> ${i.start} al ${i.end}<br>
            <b>Presupuesto:</b> ${currency(i.budget)}
          </div>
        </div>

        <div class="kpi-result">
          <div>
            <small>Avance de la Iniciativa</small>
            <strong>${i.progress}%</strong>
          </div>
          <span class="status ${i.status === 'Finalizada' ? 'good' : i.status === 'En riesgo' ? 'bad' : 'blue'}">
            ${i.status}
          </span>
        </div>

        <div class="progress-track" style="height:12px;">
          <div class="progress-fill" style="width:${i.progress}%; height:12px; background:${i.progress === 100 ? '#059669' : '#2563eb'};"></div>
        </div>

        <div class="field">
          <label for="detailProgress">Actualizar Avance (%)</label>
          <input id="detailProgress" type="number" min="0" max="100" value="${i.progress}">
        </div>
        <div class="field">
          <label for="detailStatus">Estado del Proyecto</label>
          <select id="detailStatus">
            ${["Planificada", "En ejecución", "En riesgo", "Finalizada"].map(x => `<option ${x === i.status ? 'selected' : ''}>${x}</option>`).join("")}
          </select>
        </div>
      </div>
    `;

    showModal(`${i.id} · Seguimiento de Iniciativa`, body, "Guardar Avance", () => {
      const p = Number($("#detailProgress").value);
      if (p < 0 || p > 100) {
        toast("El avance debe estar entre 0 y 100.", "error");
        return;
      }
      i.progress = p;
      i.status = p === 100 ? "Finalizada" : $("#detailStatus").value;
      recordAudit("Seguimiento", "Iniciativa", `${i.id}: avance actualizado a ${p}%`);
      saveState();
      closeModal();
      renderPage(currentPage);
      toast("Avance de la iniciativa actualizado");
    }, "INICIATIVA");
  }

  // TABLA DE KPIS ESTÁNDAR
  function renderKpiTable(list, withActions = true) {
    if (!list.length) {
      return `<div class="empty-state"><strong>Sin indicadores en este criterio</strong>Todo se encuentra en orden.</div>`;
    }

    return `
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Código / Indicador</th>
              <th>Perspectiva</th>
              <th>Meta</th>
              <th>Real Acum.</th>
              <th>% Cumpl.</th>
              <th>Estado</th>
              <th>Recomendación Estratégica</th>
              ${withActions ? "<th>Acciones</th>" : ""}
            </tr>
          </thead>
          <tbody>
            ${list.map(k => {
              const s = statusOf(k);
              const p = perspectives[k.perspective];
              return `
                <tr>
                  <td>
                    <span class="code">${escapeHtml(k.id)}</span>
                    <strong style="display:block; margin-top:2px;">${escapeHtml(k.name)}</strong>
                  </td>
                  <td>
                    <span class="tag" style="background:${p?.soft || '#f1f5f9'}; color:${p?.color || '#334155'}; font-weight:700;">
                      ${p?.icon || ''} ${escapeHtml(perspectiveLabel(k.perspective))}
                    </span>
                  </td>
                  <td>${fmt(k.target, 1)} ${escapeHtml(k.unit)}</td>
                  <td><strong style="color:var(--ink);">${fmt(k.current, 1)} ${escapeHtml(k.unit)}</strong></td>
                  <td style="font-family:'JetBrains Mono', monospace; font-weight:800;">
                    ${s.pct !== null ? fmt(s.pct, 1) + "%" : "—"}
                  </td>
                  <td>${statusBadge(k)}</td>
                  <td style="max-width:280px; white-space:normal; font-size:11px; color:#475569;">
                    ${escapeHtml(k.recommendation || k.description)}
                  </td>
                  ${withActions ? `
                    <td>
                      <div class="table-actions">
                        <button class="text-action" data-action="kpi-detail" data-id="${k.id}">Ficha</button>
                        <button class="text-action" data-action="measure-kpi" data-id="${k.id}">Medir</button>
                      </div>
                    </td>
                  ` : ""}
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // REPORTES Y GENERACIÓN DE VISTAS
  // -------------------------------------------------------------
  function generateReport(type) {
    let title = "Reporte del Balanced Scorecard";
    let sub = "TechPeru SAC · Período 2025";
    let contentHtml = "";

    if (type === "general") {
      title = "Reporte General del BSC — TechPeru SAC 2025";
      sub = "36 Indicadores de las 4 Perspectivas con Semaforización Ejecutiva";
      contentHtml = renderBscFullTable(state.kpis);
    } else if (type === "perspectivas") {
      title = "Reporte de Desempeño por Perspectiva";
      sub = "Evaluación comparativa y metas estratégicas 2025";
      contentHtml = `
        <div class="perspective-bars" style="margin-bottom:24px;">
          ${perspectiveBreakdown().map(p => `
            <div class="perspective-row">
              <div class="perspective-name">
                <span class="persp-dot" style="background:${p.color}"></span>
                <strong>${p.icon} ${p.label}</strong>
              </div>
              <div class="progress-track">
                <div class="progress-fill" style="width:${p.pct || 0}%; background:${p.color}"></div>
              </div>
              <div class="perspective-value">${p.pct !== null ? fmt(p.pct) + "%" : "—"}</div>
            </div>
          `).join("")}
        </div>
        ${renderBscFullTable(state.kpis)}
      `;
    } else if (type === "criticos") {
      title = "Reporte de Indicadores Críticos y en Riesgo";
      sub = "6 Críticos (<75%) y 19 en Riesgo (75–89%) con Acciones Recomendadas";
      const criticals = state.kpis.filter(k => ["bad", "warn"].includes(statusOf(k).key));
      contentHtml = renderBscFullTable(criticals);
    } else if (type === "iniciativas") {
      title = "Reporte del Portafolio de Iniciativas Estratégicas";
      sub = "8 Proyectos Estratégicos vinculados a los Objetivos del BSC";
      contentHtml = initiativesTable(state.initiatives);
    } else if (type === "mediciones") {
      title = "Historial Completo de Mediciones 2025";
      sub = "Registro cronológico de resultados reales consolidados";
      const all = state.kpis.flatMap(k => k.measurements.map(m => ({ ...m, kpi: k }))).sort((a, b) => b.date.localeCompare(a.date));
      contentHtml = measurementTable(all);
    } else if (type === "kpis") {
      title = "Catálogo Técnico de los 36 KPIs";
      sub = "Fórmulas, metas, baseline y sentidos de medición";
      contentHtml = kpisFullTable(state.kpis);
    }

    $("#reportResultTitle").textContent = title;
    $("#reportResultSub").textContent = sub;
    $("#reportResult").innerHTML = contentHtml;
    toast(`Reporte generado: ${title}`);
  }

  // -------------------------------------------------------------
  // EXPORTACIÓN A CSV Y DESCARGAS
  // -------------------------------------------------------------
  function exportBscCSV() {
    const rows = [
      ["Perspectiva", "Objetivo Estratégico", "Código KPI", "Indicador", "Unidad", "Meta Anual", "Real Acum.", "% Cumplimiento", "Estado", "Sentido", "Análisis / Acción Recomendada"],
      ...state.kpis.map(k => [
        perspectiveLabel(k.perspective),
        objectiveName(k.objectiveId),
        k.id,
        k.name,
        k.unit,
        k.target,
        k.current,
        achievement(k) !== null ? Number(achievement(k).toFixed(1)) + "%" : "Sin datos",
        statusOf(k).label,
        k.direction === "menor" ? "Menor es mejor" : "Mayor es mejor",
        k.recommendation || ""
      ])
    ];
    exportCSV("TechPeru_BSC_Completo_2025.csv", rows);
  }

  function exportCurrentReport() {
    exportBscCSV();
  }

  function exportMeasurements() {
    const rows = [
      ["ID Medición", "Código KPI", "Nombre Indicador", "Período", "Fecha", "Valor", "Unidad", "Responsable", "Observaciones"],
      ...state.kpis.flatMap(k => k.measurements.map(m => [
        m.id,
        k.id,
        k.name,
        m.period,
        m.date,
        m.value,
        k.unit,
        m.responsible,
        m.notes
      ]))
    ];
    exportCSV("TechPeru_Historial_Mediciones_2025.csv", rows);
  }

  function exportCSV(filename, rows) {
    const csv = rows.map(r => r.map(v => {
      let s = String(v ?? "");
      if (/[",\n;]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
      return s;
    }).join(";")).join("\r\n");

    downloadBlob(filename, "\ufeff" + csv, "text/csv;charset=utf-8");
  }

  function downloadBlob(filename, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function confirmReset() {
    showModal(
      "Restaurar Datos de Demostración",
      `
        <div class="info-box">
          <strong>¿Restaurar los datos originales del Balanced Scorecard de TechPeru SAC 2025?</strong>
          <p style="margin:8px 0 0; color:var(--red);">Se restablecerán los 12 objetivos, los 36 KPIs oficiales con sus valores acumulados y las 8 iniciativas.</p>
        </div>
      `,
      "Restaurar Todo",
      () => {
        state = demoState();
        saveState();
        updateCriticalBadge();
        closeModal();
        renderPage("dashboard");
        toast("Datos originales de TechPeru SAC 2025 restaurados");
      },
      "CONFIRMACIÓN"
    );
  }

  // -------------------------------------------------------------
  // INICIALIZACIÓN DE LA APLICACIÓN
  // -------------------------------------------------------------
  function init() {
    state = loadState();

    // Login Form Submit
    $("#loginForm").addEventListener("submit", e => {
      e.preventDefault();
      const user = $("#loginUser").value.trim();
      const pass = $("#loginPass").value;
      const ok = login(user, pass);
      $("#loginError").classList.toggle("hidden", ok);
      if (!ok) {
        toast("Usuario o contraseña incorrectos.", "error");
      }
    });

    // Cerrar sesión
    $("#logoutBtn").addEventListener("click", logout);

    // Navegación Sidebar
    $("#mainNav").addEventListener("click", e => {
      const b = e.target.closest("[data-page]");
      if (b) navigate(b.dataset.page);
    });

    // Menú móvil
    $("#menuToggle").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
    $("#sidebarClose").addEventListener("click", () => $("#sidebar").classList.remove("open"));

    // Selector de Período Global
    $("#globalPeriod").value = state.period || "2025";
    $("#globalPeriod").addEventListener("change", () => {
      state.period = $("#globalPeriod").value;
      saveState();
      renderPage(currentPage);
      toast(`Período de evaluación cambiado a ${state.period}`);
    });

    // Notificaciones de KPIs Críticos
    $("#notificationsBtn").addEventListener("click", () => {
      const existing = $(".notification-pop");
      if (existing) {
        existing.remove();
        return;
      }

      const pop = document.createElement("div");
      pop.className = "notification-pop";
      const criticals = state.kpis.filter(k => statusOf(k).key === "bad");

      pop.innerHTML = `
        <h3>
          <span>Alertas Críticas (&lt;75%)</span>
          <span class="status bad">${criticals.length} Críticos</span>
        </h3>
        ${criticals.map(k => `
          <div class="notification-item" style="cursor:pointer;" data-action="kpi-detail" data-id="${k.id}">
            <strong>${escapeHtml(k.name)} (${k.id})</strong>
            <span class="status bad">${statusOf(k).badge} · ${fmt(achievement(k))}%</span>
            <small>${escapeHtml(k.recommendation || "")}</small>
          </div>
        `).join("") || `<p class="muted">No hay indicadores en estado crítico.</p>`}
      `;

      pop.onclick = ev => {
        const item = ev.target.closest("[data-action='kpi-detail']");
        if (item) {
          showKpiDetail(item.dataset.id);
          pop.remove();
        }
      };

      document.body.append(pop);

      document.addEventListener("click", function closePop(ev) {
        if (!pop.contains(ev.target) && ev.target !== $("#notificationsBtn")) {
          pop.remove();
          document.removeEventListener("click", closePop);
        }
      });
    });

    // Restaurar sesión o mostrar pantalla de login
    if (location.hash && renderers[location.hash.slice(1)]) {
      currentPage = location.hash.slice(1);
    }

    if (restoreUser()) {
      showApp();
    } else {
      showLogin();
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();