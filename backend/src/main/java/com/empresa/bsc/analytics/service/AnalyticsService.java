package com.empresa.bsc.analytics.service;

import com.empresa.bsc.analytics.dto.DashboardSummaryDto;
import com.empresa.bsc.analytics.dto.MonthlyTrendDto;
import com.empresa.bsc.analytics.dto.PerspectiveBreakdownDto;
import com.empresa.bsc.initiatives.model.StrategicInitiative;
import com.empresa.bsc.initiatives.service.InitiativeService;
import com.empresa.bsc.kpi.event.KpiMeasurementRecordedEvent;
import com.empresa.bsc.kpi.model.Kpi;
import com.empresa.bsc.kpi.service.KpiService;
import com.empresa.bsc.shared.enums.PerspectiveType;
import com.empresa.bsc.shared.enums.TrafficLightStatus;
import com.empresa.bsc.shared.util.CsvProcessorUtil;
import com.empresa.bsc.shared.util.ExcelProcessorUtil;
import com.empresa.bsc.strategy.model.StrategicObjective;
import com.empresa.bsc.strategy.service.StrategyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.modulith.events.ApplicationModuleListener;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsService {

    private final KpiService kpiService;
    private final StrategyService strategyService;
    private final InitiativeService initiativeService;

    @ApplicationModuleListener
    public void onKpiMeasurementRecorded(KpiMeasurementRecordedEvent event) {
        log.info("📊 [Spring Modulith Event] KpiMeasurementRecordedEvent recibido para KPI [{} - {}]: valor={}, cumplimiento={}%",
                event.kpiId(), event.kpiName(), event.value(), event.compliance());
    }

    public DashboardSummaryDto getDashboardSummary() {
        List<Kpi> kpis = kpiService.getAllKpis();
        List<StrategicObjective> objectives = strategyService.getAllObjectives();
        List<StrategicInitiative> initiatives = initiativeService.getAllInitiatives();

        int goodCount = 0;
        int warnCount = 0;
        int badCount = 0;
        int noDataCount = 0;
        double sumCompliance = 0.0;
        int validComplianceCount = 0;

        for (Kpi k : kpis) {
            TrafficLightStatus s = k.getStatus();
            if (s == TrafficLightStatus.LOGRADO) goodCount++;
            else if (s == TrafficLightStatus.EN_RIESGO) warnCount++;
            else if (s == TrafficLightStatus.CRITICO) badCount++;
            else noDataCount++;

            if (k.getCompliance() != null) {
                sumCompliance += k.getCompliance();
                validComplianceCount++;
            }
        }

        Double globalCompliance = validComplianceCount > 0 ? (sumCompliance / validComplianceCount) : 0.0;
        TrafficLightStatus globalStatus = TrafficLightStatus.fromCompliance(globalCompliance);

        // Desglose por perspectiva
        List<PerspectiveBreakdownDto> perspectiveBreakdowns = new ArrayList<>();
        for (PerspectiveType p : PerspectiveType.values()) {
            List<Kpi> pKpis = kpis.stream().filter(k -> k.getPerspective() == p).toList();
            int pGood = (int) pKpis.stream().filter(k -> k.getStatus() == TrafficLightStatus.LOGRADO).count();
            int pWarn = (int) pKpis.stream().filter(k -> k.getStatus() == TrafficLightStatus.EN_RIESGO).count();
            int pBad = (int) pKpis.stream().filter(k -> k.getStatus() == TrafficLightStatus.CRITICO).count();

            List<Double> validVals = pKpis.stream()
                    .map(Kpi::getCompliance)
                    .filter(Objects::nonNull)
                    .toList();
            Double pAvg = validVals.isEmpty() ? null :
                    BigDecimal.valueOf(validVals.stream().mapToDouble(Double::doubleValue).average().orElse(0.0))
                            .setScale(1, RoundingMode.HALF_UP).doubleValue();

            perspectiveBreakdowns.add(PerspectiveBreakdownDto.builder()
                    .perspective(p)
                    .label(p.getLabel())
                    .code(p.getCode())
                    .icon(p.getIcon())
                    .color(p.getColor())
                    .softColor(p.getSoftColor())
                    .compliance(pAvg)
                    .totalKpis(pKpis.size())
                    .goodCount(pGood)
                    .warnCount(pWarn)
                    .badCount(pBad)
                    .build());
        }

        // Métricas de iniciativas
        double totalBudget = initiatives.stream().mapToDouble(i -> i.getBudget() != null ? i.getBudget() : 0.0).sum();
        double avgProgress = initiatives.isEmpty() ? 0.0 :
                initiatives.stream().mapToDouble(i -> i.getProgress() != null ? i.getProgress() : 0.0).average().orElse(0.0);

        // Tendencia mensual 2025 (Ene - Jun)
        List<MonthlyTrendDto> monthlyTrends = List.of(
                new MonthlyTrendDto("2025-01", "Ene", 74.5),
                new MonthlyTrendDto("2025-02", "Feb", 76.8),
                new MonthlyTrendDto("2025-03", "Mar", 79.1),
                new MonthlyTrendDto("2025-04", "Abr", 81.3),
                new MonthlyTrendDto("2025-05", "May", 83.0),
                new MonthlyTrendDto("2025-06", "Jun", BigDecimal.valueOf(globalCompliance).setScale(1, RoundingMode.HALF_UP).doubleValue())
        );

        // Indicadores Críticos
        List<Kpi> criticalKpis = kpis.stream()
                .filter(k -> k.getStatus() == TrafficLightStatus.CRITICO)
                .toList();

        return DashboardSummaryDto.builder()
                .company("TechPeru SAC")
                .period("2025")
                .globalCompliance(globalCompliance)
                .globalStatus(globalStatus)
                .totalObjectives(objectives.size())
                .totalKpis(kpis.size())
                .totalInitiatives(initiatives.size())
                .totalBudget(totalBudget)
                .averageProgress(avgProgress)
                .goodKpisCount(goodCount)
                .warnKpisCount(warnCount)
                .badKpisCount(badCount)
                .noDataKpisCount(noDataCount)
                .perspectives(perspectiveBreakdowns)
                .monthlyTrends(monthlyTrends)
                .criticalKpis(criticalKpis)
                .build();
    }

    public ByteArrayInputStream exportSummaryCsv() {
        DashboardSummaryDto summary = getDashboardSummary();
        List<String> headers = List.of("Métrica", "Valor");
        List<List<String>> rows = List.of(
                List.of("Cumplimiento global", String.valueOf(summary.getGlobalCompliance())),
                List.of("Objetivos", String.valueOf(summary.getTotalObjectives())),
                List.of("KPI", String.valueOf(summary.getTotalKpis())),
                List.of("Iniciativas", String.valueOf(summary.getTotalInitiatives()))
        );
        return CsvProcessorUtil.generateCsv(headers, rows);
    }

    public ByteArrayInputStream exportFullBscCsv() {
        List<Kpi> kpis = kpiService.getAllKpis();
        List<String> headers = List.of(
                "Código", "Indicador", "Perspectiva", "Objetivo", "Unidad", "Fórmula",
                "Línea Base", "Meta", "Real Acumulado", "Sentido", "Frecuencia",
                "Responsable", "Área", "% Cumplimiento", "Estado", "Acción Recomendada"
        );

        List<List<String>> rows = kpis.stream().map(k -> List.of(
                k.getId(),
                k.getName(),
                k.getPerspective().getLabel(),
                k.getObjectiveId(),
                k.getUnit() != null ? k.getUnit() : "",
                k.getFormula() != null ? k.getFormula() : "",
                String.valueOf(k.getBaseline()),
                String.valueOf(k.getTarget()),
                String.valueOf(k.getCurrent()),
                k.getDirection().getDescription(),
                k.getFrequency() != null ? k.getFrequency() : "",
                k.getOwner() != null ? k.getOwner() : "",
                k.getArea() != null ? k.getArea() : "",
                k.getCompliance() != null ? k.getCompliance() + "%" : "—",
                k.getStatus() != null ? k.getStatus().getLabel() : "—",
                k.getRecommendation() != null ? k.getRecommendation() : ""
        )).toList();

        return CsvProcessorUtil.generateCsv(headers, rows);
    }

    public ByteArrayInputStream exportExcel() {
        List<Kpi> kpis = kpiService.getAllKpis();
        List<String> headers = List.of(
                "Código", "Indicador KPI", "Perspectiva", "Objetivo", "Unidad",
                "Línea Base", "Meta", "Real Acumulado", "Sentido", "Frecuencia",
                "Responsable", "Área", "% Cumplimiento", "Estado", "Recomendación Estratégica"
        );

        List<List<Object>> rows = kpis.stream().map(k -> List.of(
                (Object) k.getId(),
                k.getName(),
                k.getPerspective().getLabel(),
                k.getObjectiveId(),
                k.getUnit() != null ? k.getUnit() : "",
                k.getBaseline() != null ? k.getBaseline() : 0.0,
                k.getTarget() != null ? k.getTarget() : 0.0,
                k.getCurrent() != null ? k.getCurrent() : 0.0,
                k.getDirection().getDescription(),
                k.getFrequency() != null ? k.getFrequency() : "",
                k.getOwner() != null ? k.getOwner() : "",
                k.getArea() != null ? k.getArea() : "",
                k.getCompliance() != null ? k.getCompliance() : 0.0,
                k.getStatus() != null ? k.getStatus().getLabel() : "—",
                k.getRecommendation() != null ? k.getRecommendation() : ""
        )).toList();

        return ExcelProcessorUtil.generateExcel("TechPeru BSC 2025", headers, rows);
    }
}
