package com.empresa.bsc.initiatives.repository;

import com.empresa.bsc.initiatives.model.StrategicInitiative;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InitiativeRepository extends JpaRepository<StrategicInitiative, String> {
    List<StrategicInitiative> findByObjectiveId(String objectiveId);
    List<StrategicInitiative> findByKpiId(String kpiId);
}
