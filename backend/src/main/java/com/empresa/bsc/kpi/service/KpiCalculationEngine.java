package com.empresa.bsc.kpi.service;

import com.empresa.bsc.kpi.model.Kpi;
import com.empresa.bsc.shared.enums.KpiDirection;
import com.empresa.bsc.shared.enums.TrafficLightStatus;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class KpiCalculationEngine {

    public Double calculateCompliance(Kpi kpi, Double value) {
        if (value == null || kpi.getTarget() == null) {
            return null;
        }

        double val = value;
        double target = kpi.getTarget();
        double complianceRaw;

        if (kpi.getDirection() == KpiDirection.RANGO) {
            double lower = kpi.getLower() != null ? kpi.getLower() : target;
            double upper = kpi.getUpper() != null ? kpi.getUpper() : target;
            if (val >= lower && val <= upper) {
                complianceRaw = 100.0;
            } else {
                double distance = val < lower ? lower - val : val - upper;
                double span = Math.max(1.0, Math.abs(upper - lower));
                complianceRaw = Math.max(0.0, 100.0 - (distance / span * 100.0));
            }
        } else if (kpi.getDirection() == KpiDirection.MENOR_MEJOR) {
            // Sentido inverso (costos, defectos, churn, CAC, incidencias, rotación): Meta / Real * 100
            if (val <= 0.0 && target <= 0.0) {
                complianceRaw = 100.0;
            } else if (val <= 0.0) {
                complianceRaw = 100.0;
            } else {
                complianceRaw = (target / val) * 100.0;
            }
        } else {
            // Sentido directo (mayor es mejor): Real / Meta * 100
            if (target == 0.0) {
                complianceRaw = val >= 0.0 ? 100.0 : 0.0;
            } else {
                complianceRaw = (val / target) * 100.0;
            }
        }

        // Redondear a 1 decimal para coincidir con la precisión del modelo oficial
        return BigDecimal.valueOf(complianceRaw)
                .setScale(1, RoundingMode.HALF_UP)
                .doubleValue();
    }

    public TrafficLightStatus determineStatus(Double compliance) {
        return TrafficLightStatus.fromCompliance(compliance);
    }
}
