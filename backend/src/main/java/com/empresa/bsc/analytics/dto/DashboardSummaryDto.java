package com.empresa.bsc.analytics.dto;

import com.empresa.bsc.kpi.model.Kpi;
import com.empresa.bsc.shared.enums.TrafficLightStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDto {
    private String company;
    private String period;
    private Double globalCompliance;
    private TrafficLightStatus globalStatus;

    // Métricas cuantitativas
    private long totalObjectives;
    private long totalKpis;
    private long totalInitiatives;
    private Double totalBudget;
    private Double averageProgress;

    // Desglose del semáforo
    private int goodKpisCount;  // Logrado
    private int warnKpisCount;  // En riesgo
    private int badKpisCount;   // Crítico
    private int noDataKpisCount;// Sin datos

    // Desglose por perspectiva
    private List<PerspectiveBreakdownDto> perspectives;

    // Tendencia mensual
    private List<MonthlyTrendDto> monthlyTrends;

    // Indicadores críticos prioritarios
    private List<Kpi> criticalKpis;
}
