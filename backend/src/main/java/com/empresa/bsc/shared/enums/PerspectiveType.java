package com.empresa.bsc.shared.enums;

import lombok.Getter;

@Getter
public enum PerspectiveType {
    FINANCIERA("Financiera", "FIN", "#1d4ed8", "#eff6ff", "💰", 1),
    CLIENTES("Clientes", "CLI", "#0d9488", "#f0fdfa", "👥", 2),
    PROCESOS("Procesos internos", "PRO", "#d97706", "#fffbeb", "🔧", 3),
    APRENDIZAJE("Aprendizaje y crecimiento", "APR", "#7c3aed", "#f5f3ff", "📚", 4);

    private final String label;
    private final String code;
    private final String color;
    private final String softColor;
    private final String icon;
    private final int displayOrder;

    PerspectiveType(String label, String code, String color, String softColor, String icon, int displayOrder) {
        this.label = label;
        this.code = code;
        this.color = color;
        this.softColor = softColor;
        this.icon = icon;
        this.displayOrder = displayOrder;
    }
}
