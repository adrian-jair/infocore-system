package com.empresa.bsc.strategy.service;

import com.empresa.bsc.shared.enums.PerspectiveType;
import com.empresa.bsc.shared.exception.ResourceNotFoundException;
import com.empresa.bsc.strategy.model.Perspective;
import com.empresa.bsc.strategy.model.StrategicObjective;
import com.empresa.bsc.strategy.model.StrategyLink;
import com.empresa.bsc.strategy.repository.ObjectiveRepository;
import com.empresa.bsc.strategy.repository.PerspectiveRepository;
import com.empresa.bsc.strategy.repository.StrategyLinkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StrategyService {

    private final PerspectiveRepository perspectiveRepository;
    private final ObjectiveRepository objectiveRepository;
    private final StrategyLinkRepository strategyLinkRepository;

    public List<Perspective> getAllPerspectives() {
        return perspectiveRepository.findAllByOrderByDisplayOrderAsc();
    }

    public List<StrategicObjective> getAllObjectives() {
        return objectiveRepository.findAll();
    }

    public StrategicObjective getObjectiveById(String id) {
        return objectiveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Objetivo Estratégico", id));
    }

    public List<StrategicObjective> getObjectivesByPerspective(PerspectiveType perspective) {
        return objectiveRepository.findByPerspective(perspective);
    }

    @Transactional
    public StrategicObjective createObjective(StrategicObjective objective) {
        if (objective.getId() == null || objective.getId().isBlank()) {
            String prefix = switch (objective.getPerspective()) {
                case FINANCIERA -> "OBJ-F";
                case CLIENTES -> "OBJ-C";
                case PROCESOS -> "OBJ-P";
                case APRENDIZAJE -> "OBJ-A";
            };
            long count = objectiveRepository.findByPerspective(objective.getPerspective()).size() + 1;
            objective.setId(prefix + count);
        }
        return objectiveRepository.save(objective);
    }

    @Transactional
    public StrategicObjective updateObjective(String id, StrategicObjective updated) {
        StrategicObjective existing = getObjectiveById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setOwner(updated.getOwner());
        existing.setPriority(updated.getPriority());
        existing.setWeight(updated.getWeight());
        existing.setStatus(updated.getStatus());
        existing.setPerspective(updated.getPerspective());
        return objectiveRepository.save(existing);
    }

    @Transactional
    public void deleteObjective(String id) {
        StrategicObjective existing = getObjectiveById(id);
        objectiveRepository.delete(existing);
    }

    public List<StrategyLink> getAllLinks() {
        return strategyLinkRepository.findAll();
    }

    @Transactional
    public StrategyLink createLink(StrategyLink link) {
        return strategyLinkRepository.save(link);
    }
}
