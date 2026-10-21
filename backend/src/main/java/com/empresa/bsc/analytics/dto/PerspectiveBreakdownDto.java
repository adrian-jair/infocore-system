package com.empresa.bsc.analytics.dto;

import com.empresa.bsc.shared.enums.PerspectiveType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerspectiveBreakdownDto {
    private PerspectiveType perspective;
    private String label;
    private String code;
    private String icon;
    private String color;
    private String softColor;
    private Double compliance;
    private int totalKpis;
    private int goodCount; // Logrado
    private int warnCount; // En riesgo
    private int badCount;  // Crítico
}
