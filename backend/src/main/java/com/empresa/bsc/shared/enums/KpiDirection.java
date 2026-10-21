package com.empresa.bsc.shared.enums;

import lombok.Getter;

@Getter
public enum KpiDirection {
    MAYOR_MEJOR("Mayor es mejor", "directo"),
    MENOR_MEJOR("Menor es mejor", "inverso"),
    RANGO("Rango óptimo", "rango");

    private final String description;
    private final String code;

    KpiDirection(String description, String code) {
        this.description = description;
        this.code = code;
    }

    public static KpiDirection fromCode(String code) {
        if (code == null) return MAYOR_MEJOR;
        return switch (code.toLowerCase()) {
            case "menor", "inverso" -> MENOR_MEJOR;
            case "rango" -> RANGO;
            default -> MAYOR_MEJOR;
        };
    }
}
