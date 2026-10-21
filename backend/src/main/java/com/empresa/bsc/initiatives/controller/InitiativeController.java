package com.empresa.bsc.initiatives.controller;

import com.empresa.bsc.initiatives.model.StrategicInitiative;
import com.empresa.bsc.initiatives.service.InitiativeService;
import com.empresa.bsc.shared.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/initiatives")
@RequiredArgsConstructor
@Tag(name = "5. Iniciativas Estratégicas", description = "Portafolio de proyectos, avance porcentual, presupuesto y vinculación con KPIs")
public class InitiativeController {

    private final InitiativeService initiativeService;

    @GetMapping
    @Operation(summary = "Listar todas las iniciativas estratégicas")
    public ResponseEntity<ApiResponse<List<StrategicInitiative>>> getAllInitiatives() {
        return ResponseEntity.ok(ApiResponse.ok(initiativeService.getAllInitiatives()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener detalle de una iniciativa estratégica")
    public ResponseEntity<ApiResponse<StrategicInitiative>> getInitiativeById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(initiativeService.getInitiativeById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'GERENTE')")
    @Operation(summary = "Crear nueva iniciativa estratégica")
    public ResponseEntity<ApiResponse<StrategicInitiative>> createInitiative(@RequestBody StrategicInitiative initiative) {
        StrategicInitiative created = initiativeService.createInitiative(initiative);
        return ResponseEntity.ok(ApiResponse.ok("Iniciativa estratégica creada exitosamente", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GERENTE')")
    @Operation(summary = "Actualizar iniciativa estratégica")
    public ResponseEntity<ApiResponse<StrategicInitiative>> updateInitiative(
            @PathVariable String id, @RequestBody StrategicInitiative initiative) {
        StrategicInitiative updated = initiativeService.updateInitiative(id, initiative);
        return ResponseEntity.ok(ApiResponse.ok("Iniciativa estratégica actualizada exitosamente", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Eliminar iniciativa estratégica")
    public ResponseEntity<ApiResponse<Void>> deleteInitiative(@PathVariable String id) {
        initiativeService.deleteInitiative(id);
        return ResponseEntity.ok(ApiResponse.ok("Iniciativa estratégica eliminada exitosamente", null));
    }
}
