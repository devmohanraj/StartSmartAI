package com.startsmart.ai.riskanalyzer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectResponseDTO {

    private Long projectId;
    private String projectName;
    private String projectType;
    private String businessModel;
    private BigDecimal budget;
    private String targetMarket;
    private String description;
    private LocalDateTime createdAt;
}