package com.empresa.bsc.kpi.event;

import com.empresa.bsc.shared.enums.TrafficLightStatus;

import java.time.LocalDateTime;

/**
 * Domain Event published when a KPI measurement is recorded or updated.
 * Observed by analytics and other modules in the Spring Modulith architecture.
 */
public record KpiMeasurementRecordedEvent(
        String kpiId,
        String kpiName,
        String period,
        Double value,
        Double compliance,
        TrafficLightStatus status,
        LocalDateTime timestamp
) {
}
