package com.empresa.bsc.shared.enums;

import lombok.Getter;

@Getter
public enum RoleType {
    ROLE_ADMIN("Administrador", "Acceso total a configuración, CRUD estratégico, usuarios y auditoría"),
    ROLE_GERENTE("Gerente", "Edición de objetivos, KPIs, iniciativas y registro de mediciones"),
    ROLE_RESPONSABLE("Responsable", "Consulta y registro de mediciones periódicas");

    private final String display;
    private final String description;

    RoleType(String display, String description) {
        this.display = display;
        this.description = description;
    }
}
