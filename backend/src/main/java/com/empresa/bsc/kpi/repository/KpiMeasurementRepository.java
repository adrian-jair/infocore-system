package com.empresa.bsc.kpi.repository;

import com.empresa.bsc.kpi.model.KpiMeasurement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface KpiMeasurementRepository extends JpaRepository<KpiMeasurement, String> {
    List<KpiMeasurement> findByKpiIdOrderByPeriodAsc(String kpiId);
    Optional<KpiMeasurement> findByKpiIdAndPeriod(String kpiId, String period);
}
