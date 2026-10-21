package com.empresa.bsc.kpi.repository;

import com.empresa.bsc.kpi.model.Kpi;
import com.empresa.bsc.shared.enums.PerspectiveType;
import com.empresa.bsc.shared.enums.TrafficLightStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KpiRepository extends JpaRepository<Kpi, String> {
    List<Kpi> findByPerspective(PerspectiveType perspective);
    List<Kpi> findByObjectiveId(String objectiveId);
    List<Kpi> findByStatus(TrafficLightStatus status);
}
