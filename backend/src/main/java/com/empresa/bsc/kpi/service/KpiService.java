package com.empresa.bsc.kpi.service;

import com.empresa.bsc.kpi.event.KpiMeasurementRecordedEvent;
import com.empresa.bsc.kpi.model.Kpi;
import com.empresa.bsc.kpi.model.KpiMeasurement;
import com.empresa.bsc.kpi.repository.KpiMeasurementRepository;
import com.empresa.bsc.kpi.repository.KpiRepository;
import com.empresa.bsc.shared.enums.PerspectiveType;
import com.empresa.bsc.shared.enums.TrafficLightStatus;
import com.empresa.bsc.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class KpiService {

    private final KpiRepository kpiRepository;
    private final KpiMeasurementRepository measurementRepository;
    private final KpiCalculationEngine calculationEngine;
    private final ApplicationEventPublisher eventPublisher;

    public List<Kpi> getAllKpis() {
        return kpiRepository.findAll();
    }

    public List<Kpi> getKpisByPerspective(PerspectiveType perspective) {
        return kpiRepository.findByPerspective(perspective);
    }

    public List<Kpi> getKpisByObjective(String objectiveId) {
        return kpiRepository.findByObjectiveId(objectiveId);
    }

    public List<Kpi> getKpisByStatus(TrafficLightStatus status) {
        return kpiRepository.findByStatus(status);
    }

    public Kpi getKpiById(String id) {
        return kpiRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Indicador KPI", id));
    }

    @Transactional
    public Kpi createKpi(Kpi kpi) {
        if (kpi.getId() == null || kpi.getId().isBlank()) {
            String prefix = switch (kpi.getPerspective()) {
                case FINANCIERA -> "KPI-F";
                case CLIENTES -> "KPI-C";
                case PROCESOS -> "KPI-P";
                case APRENDIZAJE -> "KPI-A";
            };
            long count = kpiRepository.findByPerspective(kpi.getPerspective()).size() + 1;
            kpi.setId(String.format("%s%02d", prefix, count));
        }

        recalculateKpi(kpi);
        return kpiRepository.save(kpi);
    }

    @Transactional
    public Kpi updateKpi(String id, Kpi updated) {
        Kpi existing = getKpiById(id);
        existing.setName(updated.getName());
        existing.setPerspective(updated.getPerspective());
        existing.setObjectiveId(updated.getObjectiveId());
        existing.setUnit(updated.getUnit());
        existing.setFormula(updated.getFormula());
        existing.setBaseline(updated.getBaseline());
        existing.setTarget(updated.getTarget());
        existing.setDirection(updated.getDirection());
        existing.setFrequency(updated.getFrequency());
        existing.setOwner(updated.getOwner());
        existing.setArea(updated.getArea());
        existing.setWeight(updated.getWeight());
        existing.setRecommendation(updated.getRecommendation());
        existing.setDescription(updated.getDescription());
        existing.setLower(updated.getLower());
        existing.setUpper(updated.getUpper());

        recalculateKpi(existing);
        return kpiRepository.save(existing);
    }

    @Transactional
    public void deleteKpi(String id) {
        Kpi existing = getKpiById(id);
        kpiRepository.delete(existing);
    }

    @Transactional
    public KpiMeasurement recordMeasurement(String kpiId, KpiMeasurement measurement) {
        Kpi kpi = getKpiById(kpiId);

        if (measurement.getId() == null || measurement.getId().isBlank()) {
            measurement.setId(String.format("M-%s-%s", kpiId, measurement.getPeriod()));
        }
        if (measurement.getDate() == null || measurement.getDate().isBlank()) {
            measurement.setDate(LocalDate.now().toString());
        }
        measurement.setKpiId(kpiId);

        // Si ya existe registro para ese período, actualizarlo
        KpiMeasurement savedMeasurement = measurementRepository.findByKpiIdAndPeriod(kpiId, measurement.getPeriod())
                .map(existing -> {
                    existing.setValue(measurement.getValue());
                    existing.setDate(measurement.getDate());
                    existing.setNotes(measurement.getNotes());
                    existing.setResponsible(measurement.getResponsible());
                    return measurementRepository.save(existing);
                })
                .orElseGet(() -> measurementRepository.save(measurement));

        // Actualizar el valor actual del KPI con el último valor registrado
        kpi.setCurrent(savedMeasurement.getValue());
        recalculateKpi(kpi);
        kpiRepository.save(kpi);

        // Publicar evento de dominio desacoplado mediante Spring Modulith
        eventPublisher.publishEvent(new KpiMeasurementRecordedEvent(
                kpi.getId(),
                kpi.getName(),
                savedMeasurement.getPeriod(),
                savedMeasurement.getValue(),
                kpi.getCompliance(),
                kpi.getStatus(),
                LocalDateTime.now()
        ));

        return savedMeasurement;
    }

    public List<KpiMeasurement> getMeasurementsByKpi(String kpiId) {
        return measurementRepository.findByKpiIdOrderByPeriodAsc(kpiId);
    }

    public void recalculateKpi(Kpi kpi) {
        Double compliance = calculationEngine.calculateCompliance(kpi, kpi.getCurrent());
        kpi.setCompliance(compliance);
        kpi.setStatus(calculationEngine.determineStatus(compliance));
    }
}
