package com.empresa.bsc.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyTrendDto {
    private String period; // 2025-01 ... 2025-06
    private String label;  // Ene, Feb, Mar, Abr, May, Jun
    private Double compliance;
}
