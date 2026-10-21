package com.empresa.bsc.initiatives.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bsc_strategic_initiatives")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StrategicInitiative {

    @Id
    private String id; // INI-01, INI-02, etc.

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String objectiveId;

    private String kpiId;
    private String owner;
    private String area;

    private String startDate; // YYYY-MM-DD
    private String endDate;   // YYYY-MM-DD

    private Double budget;    // Presupuesto en Soles (S/)
    private Double progress;  // 0 - 100 %
    private String status;    // En ejecución, En riesgo, Concluido, Planificado

    @Column(length = 1000)
    private String description;
}
