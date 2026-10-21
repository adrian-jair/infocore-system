package com.empresa.bsc.shared.enums;

import lombok.Getter;

@Getter
public enum TrafficLightStatus {
    LOGRADO("Logrado", "✅", "#16a34a", "#dcfce7", 90.0),
    EN_RIESGO("En riesgo", "⚠", "#d97706", "#fef3c7", 75.0),
    CRITICO("Crítico", "❌", "#dc2626", "#fee2e2", 0.0),
    SIN_DATOS("Sin datos", "⚪", "#64748b", "#f1f5f9", -1.0);

    private final String label;
    private final String icon;
    private final String color;
    private final String bgColor;
    private final double minThreshold;

    TrafficLightStatus(String label, String icon, String color, String bgColor, double minThreshold) {
        this.label = label;
        this.icon = icon;
        this.color = color;
        this.bgColor = bgColor;
        this.minThreshold = minThreshold;
    }

    public static TrafficLightStatus fromCompliance(Double compliance) {
        if (compliance == null) return SIN_DATOS;
        if (compliance >= 90.0) return LOGRADO;
        if (compliance >= 75.0) return EN_RIESGO;
        return CRITICO;
    }
}
