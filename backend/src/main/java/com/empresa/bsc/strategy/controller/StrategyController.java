package com.empresa.bsc.strategy.controller;

import com.empresa.bsc.shared.dto.ApiResponse;
import com.empresa.bsc.shared.enums.PerspectiveType;
import com.empresa.bsc.strategy.model.Perspective;
import com.empresa.bsc.strategy.model.StrategicObjective;
import com.empresa.bsc.strategy.model.StrategyLink;
import com.empresa.bsc.strategy.service.StrategyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/strategy")
@RequiredArgsConstructor
@Tag(name = "3. Estrategia y Mapa Estratégico", description = "Gestión de las 4 perspectivas, 12 objetivos y enlaces de causa-efecto")
public class StrategyController {

    private final StrategyService strategyService;

    @GetMapping("/perspectives")
    @Operation(summary = "Listar las 4 perspectivas oficiales del BSC")
    public ResponseEntity<ApiResponse<List<Perspective>>> getPerspectives() {
        return ResponseEntity.ok(ApiResponse.ok(strategyService.getAllPerspectives()));
    }

    @GetMapping("/objectives")
    @Operation(summary = "Listar todos los objetivos estratégicos")
    public ResponseEntity<ApiResponse<List<StrategicObjective>>> getObjectives(
            @RequestParam(required = false) PerspectiveType perspective) {
        if (perspective != null) {
            return ResponseEntity.ok(ApiResponse.ok(strategyService.getObjectivesByPerspective(perspective)));
        }
        return ResponseEntity.ok(ApiResponse.ok(strategyService.getAllObjectives()));
    }

    @GetMapping("/objectives/{id}")
    @Operation(summary = "Obtener detalle de un objetivo estratégico")
    public ResponseEntity<ApiResponse<StrategicObjective>> getObjectiveById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(strategyService.getObjectiveById(id)));
    }

    @PostMapping("/objectives")
    @PreAuthorize("hasAnyRole('ADMIN', 'GERENTE')")
    @Operation(summary = "Crear nuevo objetivo estratégico")
    public ResponseEntity<ApiResponse<StrategicObjective>> createObjective(@RequestBody StrategicObjective objective) {
        StrategicObjective created = strategyService.createObjective(objective);
        return ResponseEntity.ok(ApiResponse.ok("Objetivo estratégico creado exitosamente", created));
    }

    @PutMapping("/objectives/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GERENTE')")
    @Operation(summary = "Actualizar objetivo estratégico existente")
    public ResponseEntity<ApiResponse<StrategicObjective>> updateObjective(
            @PathVariable String id, @RequestBody StrategicObjective objective) {
        StrategicObjective updated = strategyService.updateObjective(id, objective);
        return ResponseEntity.ok(ApiResponse.ok("Objetivo estratégico actualizado exitosamente", updated));
    }

    @DeleteMapping("/objectives/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Eliminar objetivo estratégico")
    public ResponseEntity<ApiResponse<Void>> deleteObjective(@PathVariable String id) {
        strategyService.deleteObjective(id);
        return ResponseEntity.ok(ApiResponse.ok("Objetivo estratégico eliminado exitosamente", null));
    }

    @GetMapping("/links")
    @Operation(summary = "Obtener enlaces de Causa y Efecto para el Mapa Estratégico")
    public ResponseEntity<ApiResponse<List<StrategyLink>>> getStrategyLinks() {
        return ResponseEntity.ok(ApiResponse.ok(strategyService.getAllLinks()));
    }

    @PostMapping("/links")
    @PreAuthorize("hasAnyRole('ADMIN', 'GERENTE')")
    @Operation(summary = "Crear nuevo enlace de Causa y Efecto")
    public ResponseEntity<ApiResponse<StrategyLink>> createLink(@RequestBody StrategyLink link) {
        return ResponseEntity.ok(ApiResponse.ok("Enlace creado exitosamente", strategyService.createLink(link)));
    }
}
