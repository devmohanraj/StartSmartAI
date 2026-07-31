package com.startsmart.ai.riskanalyzer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProjectRequestDTO {

    @NotBlank(message = "Project name is required")
    @Schema(description = "The name of the startup or project being submitted for analysis")
    private String projectName;

    @NotBlank(message = "Industry/sector is required")
    @Schema(description = "The industry or sector the startup operates in, e.g. FinTech, Healthcare")
    private String industrySector;

    @NotBlank(message = "Business model is required")
    @Schema(description = "The business model of the startup, e.g. SaaS, Marketplace, D2C")
    private String businessModel;

    @NotBlank(message = "Target market is required")
    @Schema(description = "The target market or customer segment, e.g. SMBs, Enterprises, Consumers")
    private String targetMarket;

    @NotNull(message = "Budget is required")
    @Positive(message = "Budget must be positive")
    @Schema(description = "The project budget in USD")
    private BigDecimal budget;

    @Schema(description = "A brief description of the project idea and its objectives")
    private String description;
}