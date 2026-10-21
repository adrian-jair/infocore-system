package com.empresa.bsc.kpi.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bsc_kpi_measurements")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KpiMeasurement {

    @Id
    private String id; // M-KPI-F01-2025-01

    @Column(nullable = false)
    private String kpiId;

    @Column(nullable = false)
    private String period; // YYYY-MM

    private String date; // YYYY-MM-DD

    @Column(nullable = false, name = "measurement_value")
    private Double value;

    @Column(length = 500)
    private String notes;

    private String responsible;
}
