package com.empresa.bsc;

import com.empresa.bsc.analytics.dto.DashboardSummaryDto;
import com.empresa.bsc.analytics.service.AnalyticsService;
import com.empresa.bsc.shared.enums.TrafficLightStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class BscApplicationContextTest {

    @Autowired
    private AnalyticsService analyticsService;

    @Test
    void contextLoadsAndMetricsMatchCsv() {
        assertNotNull(analyticsService);
        DashboardSummaryDto summary = analyticsService.getDashboardSummary();

        assertNotNull(summary);
        assertEquals(12, summary.getTotalObjectives(), "Deben ser exactamente 12 objetivos estratégicos");
        assertEquals(36, summary.getTotalKpis(), "Deben ser exactamente 36 KPIs");
        assertEquals(8, summary.getTotalInitiatives(), "Deben ser exactamente 8 iniciativas");

        // Exactitud con resumen_bsc.csv: Cumplimiento global = 84.22777777777779
        assertEquals(84.22777777777779, summary.getGlobalCompliance(), 0.0001,
                "El cumplimiento global debe coincidir exactamente con resumen_bsc.csv (84.22777777777779)");

        assertEquals(TrafficLightStatus.EN_RIESGO, summary.getGlobalStatus());
        assertEquals(11, summary.getGoodKpisCount(), "11 Logrados");
        assertEquals(19, summary.getWarnKpisCount(), "19 En riesgo");
        assertEquals(6, summary.getBadKpisCount(), "6 Críticos");
        assertEquals(0, summary.getNoDataKpisCount(), "0 Sin datos");
    }
}
