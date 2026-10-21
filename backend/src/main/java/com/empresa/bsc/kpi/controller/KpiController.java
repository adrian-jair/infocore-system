package com.empresa.bsc.kpi.controller;

import com.empresa.bsc.kpi.model.Kpi;
import com.empresa.bsc.kpi.model.KpiMeasurement;
import com.empresa.bsc.kpi.service.KpiService;
import com.empresa.bsc.shared.dto.ApiResponse;
import com.empresa.bsc.shared.enums.PerspectiveType;
import com.empresa.bsc.shared.enums.TrafficLightStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kpis")
@RequiredArgsConstructor
@Tag(name = "4. Indicadores KPI y Mediciones", description = "Catálogo de 36 KPIs, semáforos, fórmulas y registro de resultados")
public class KpiController {

    private final KpiService kpiService;

    @GetMapping
    @Operation(summary = "Listar KPIs con filtros opcionales de perspectiva o semáforo")
    public ResponseEntity<ApiResponse<List<Kpi>>> getKpis(
            @RequestParam(required = false) PerspectiveType perspective,
            @RequestParam(required = false) TrafficLightStatus status) {
        if (perspective != null) {
            return ResponseEntity.ok(ApiResponse.ok(kpiService.getKpisByPerspective(perspective)));
        }
        if (status != null) {
            return ResponseEntity.ok(ApiResponse.ok(kpiService.getKpisByStatus(status)));
        }
        return ResponseEntity.ok(ApiResponse.ok(kpiService.getAllKpis()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener detalle completo de un indicador KPI")
    public ResponseEntity<ApiResponse<Kpi>> getKpiById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(kpiService.getKpiById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'GERENTE')")
    @Operation(summary = "Crear nuevo indicador KPI")
    public ResponseEntity<ApiResponse<Kpi>> createKpi(@RequestBody Kpi kpi) {
        Kpi created = kpiService.createKpi(kpi);
        return ResponseEntity.ok(ApiResponse.ok("Indicador KPI creado exitosamente", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GERENTE')")
    @Operation(summary = "Actualizar indicador KPI")
    public ResponseEntity<ApiResponse<Kpi>> updateKpi(@PathVariable String id, @RequestBody Kpi kpi) {
        Kpi updated = kpiService.updateKpi(id, kpi);
        return ResponseEntity.ok(ApiResponse.ok("Indicador KPI actualizado exitosamente", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Eliminar indicador KPI")
    public ResponseEntity<ApiResponse<Void>> deleteKpi(@PathVariable String id) {
        kpiService.deleteKpi(id);
        return ResponseEntity.ok(ApiResponse.ok("Indicador KPI eliminado exitosamente", null));
    }

    @GetMapping("/{id}/measurements")
    @Operation(summary = "Obtener historial de mediciones de un KPI")
    public ResponseEntity<ApiResponse<List<KpiMeasurement>>> getMeasurements(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(kpiService.getMeasurementsByKpi(id)));
    }

    @PostMapping("/{id}/measurements")
    @PreAuthorize("hasAnyRole('ADMIN', 'GERENTE', 'RESPONSABLE')")
    @Operation(summary = "Registrar nueva medición o actualizar valor mensual de un KPI")
    public ResponseEntity<ApiResponse<KpiMeasurement>> recordMeasurement(
            @PathVariable String id, @RequestBody KpiMeasurement measurement) {
        KpiMeasurement saved = kpiService.recordMeasurement(id, measurement);
        return ResponseEntity.ok(ApiResponse.ok("Medición registrada y semáforo actualizado exitosamente", saved));
    }
}
