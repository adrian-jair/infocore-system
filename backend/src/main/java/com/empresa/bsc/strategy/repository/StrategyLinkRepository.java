package com.empresa.bsc.strategy.repository;

import com.empresa.bsc.strategy.model.StrategyLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StrategyLinkRepository extends JpaRepository<StrategyLink, String> {
    List<StrategyLink> findBySourceObjectiveId(String sourceObjectiveId);
    List<StrategyLink> findByTargetObjectiveId(String targetObjectiveId);
}
