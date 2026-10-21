package com.empresa.bsc.strategy.repository;

import com.empresa.bsc.shared.enums.PerspectiveType;
import com.empresa.bsc.strategy.model.StrategicObjective;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ObjectiveRepository extends JpaRepository<StrategicObjective, String> {
    List<StrategicObjective> findByPerspective(PerspectiveType perspective);
}
