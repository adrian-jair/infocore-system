package com.empresa.bsc.initiatives.service;

import com.empresa.bsc.initiatives.model.StrategicInitiative;
import com.empresa.bsc.initiatives.repository.InitiativeRepository;
import com.empresa.bsc.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InitiativeService {

    private final InitiativeRepository initiativeRepository;

    public List<StrategicInitiative> getAllInitiatives() {
        return initiativeRepository.findAll();
    }

    public StrategicInitiative getInitiativeById(String id) {
        return initiativeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Iniciativa Estratégica", id));
    }

    public List<StrategicInitiative> getByObjective(String objectiveId) {
        return initiativeRepository.findByObjectiveId(objectiveId);
    }

    public List<StrategicInitiative> getByKpi(String kpiId) {
        return initiativeRepository.findByKpiId(kpiId);
    }

    @Transactional
    public StrategicInitiative createInitiative(StrategicInitiative initiative) {
        if (initiative.getId() == null || initiative.getId().isBlank()) {
            long count = initiativeRepository.count() + 1;
            initiative.setId(String.format("INI-%02d", count));
        }
        return initiativeRepository.save(initiative);
    }

    @Transactional
    public StrategicInitiative updateInitiative(String id, StrategicInitiative updated) {
        StrategicInitiative existing = getInitiativeById(id);
        existing.setName(updated.getName());
        existing.setObjectiveId(updated.getObjectiveId());
        existing.setKpiId(updated.getKpiId());
        existing.setOwner(updated.getOwner());
        existing.setArea(updated.getArea());
        existing.setStartDate(updated.getStartDate());
        existing.setEndDate(updated.getEndDate());
        existing.setBudget(updated.getBudget());
        existing.setProgress(updated.getProgress());
        existing.setStatus(updated.getStatus());
        existing.setDescription(updated.getDescription());
        return initiativeRepository.save(existing);
    }

    @Transactional
    public void deleteInitiative(String id) {
        StrategicInitiative existing = getInitiativeById(id);
        initiativeRepository.delete(existing);
    }
}
