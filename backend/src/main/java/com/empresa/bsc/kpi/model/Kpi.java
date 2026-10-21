package com.empresa.bsc.kpi.model;

import com.empresa.bsc.shared.enums.KpiDirection;
import com.empresa.bsc.shared.enums.PerspectiveType;
import com.empresa.bsc.shared.enums.TrafficLightStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bsc_kpis")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Kpi {

    @Id
    private String id; // KPI-F01, KPI-C01, etc.

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PerspectiveType perspective;

    @Column(nullable = false)
    private String objectiveId;

    private String unit; // %, S/ MM, pts, días, #

    @Column(length = 500)
    private String formula;

    private Double baseline;
    private Double target;
    private Double current; // Real acumulado

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private KpiDirection direction;

    private String frequency; // Mensual, Trimestral, Semestral
    private String owner;
    private String area;
    private Double weight;

    @Column(length = 1000)
    private String recommendation;

    @Column(length = 1000)
    private String description;

    private Double lower;
    private Double upper;

    @Builder.Default
    private Double alertAt = 75.0;

    @Builder.Default
    private Double criticalAt = 75.0;

    @Builder.Default
    private Double targetAt = 90.0;

    private Double compliance; // % de cumplimiento calculado

    @Enumerated(EnumType.STRING)
    private TrafficLightStatus status; // LOGRADO, EN_RIESGO, CRITICO, SIN_DATOS

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "kpiId")
    @OrderBy("period ASC")
    @Builder.Default
    private List<KpiMeasurement> measurements = new ArrayList<>();
}
