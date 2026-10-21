package com.empresa.bsc.analytics.controller;

import com.empresa.bsc.analytics.dto.DashboardSummaryDto;
import com.empresa.bsc.analytics.service.AnalyticsService;
import com.empresa.bsc.shared.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@Tag(name = "6. Analítica y Reportes Ejecutivos", description = "Consolidado de BSC, Dashboard Ejecutivo, Exportación e Importación")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    @Operation(summary = "Obtener consolidado del Dashboard Ejecutivo BSC",
            description = "Calcula el cumplimiento global (84.2%), semáforos, tendencias y KPIs críticos")
    public ResponseEntity<ApiResponse<DashboardSummaryDto>> getDashboardSummary() {
        return ResponseEntity.ok(ApiResponse.ok(analyticsService.getDashboardSummary()));
    }

    @GetMapping("/export/csv-summary")
    @Operation(summary = "Descargar resumen ejecutivo en CSV",
            description = "Genera el archivo CSV con el formato exacto del archivo resumen_bsc.csv")
    public ResponseEntity<InputStreamResource> exportSummaryCsv() {
        ByteArrayInputStream stream = analyticsService.exportSummaryCsv();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=resumen_bsc.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(new InputStreamResource(stream));
    }

    @GetMapping("/export/csv-full")
    @Operation(summary = "Descargar BSC completo en formato CSV",
            description = "Exporta los 36 KPIs con todas las columnas analíticas, metas y fórmulas")
    public ResponseEntity<InputStreamResource> exportFullCsv() {
        ByteArrayInputStream stream = analyticsService.exportFullBscCsv();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=bsc_completo_techperu_2025.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(new InputStreamResource(stream));
    }

    @GetMapping("/export/excel")
    @Operation(summary = "Descargar Cuadro de Mando en formato Microsoft Excel (.xlsx)",
            description = "Genera un libro Excel con estilos corporativos mediante Apache POI")
    public ResponseEntity<InputStreamResource> exportExcel() {
        ByteArrayInputStream stream = analyticsService.exportExcel();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=Balanced_Scorecard_TechPeru_2025.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(stream));
    }
}
