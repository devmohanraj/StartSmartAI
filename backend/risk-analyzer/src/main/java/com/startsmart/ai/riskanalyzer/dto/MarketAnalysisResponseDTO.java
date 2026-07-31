package com.startsmart.ai.riskanalyzer.dto;

import com.startsmart.ai.riskanalyzer.entity.CompetitorAnalysis;
import com.startsmart.ai.riskanalyzer.entity.MarketAnalysis;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarketAnalysisResponseDTO {

    @Schema(description = "Unique identifier for the market analysis record")
    private Long id;

    @Schema(description = "The project ID this analysis belongs to")
    private Long projectId;

    @Schema(description = "Total Addressable Market (TAM) in USD — the total revenue opportunity available if 100% market share is achieved")
    private BigDecimal marketSizeTam;

    @Schema(description = "Serviceable Addressable Market (SAM) in USD — the segment of TAM that can be reached with the product/service")
    private BigDecimal marketSizeSam;

    @Schema(description = "Serviceable Obtainable Market (SOM) in USD — the realistic share of SAM that can be captured")
    private BigDecimal marketSizeSom;

    @Schema(description = "Estimated annual market growth rate, e.g. 8.2%")
    private String growthRate;

    @Schema(description = "JSON string containing yearly market trend data from 2020 to 2026 as an array of {year, value} objects")
    private String marketTrendsJson;

    @Schema(description = "Timestamp when the analysis was generated")
    private LocalDateTime createdAt;

    @Schema(description = "List of competitors identified in the analysis")
    private List<CompetitorDTO> competitors;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CompetitorDTO {

        @Schema(description = "Unique identifier for the competitor record")
        private Long id;

        @Schema(description = "Name of the competitor company")
        private String competitorName;

        @Schema(description = "Estimated market share held by this competitor, e.g. 22%")
        private String marketShare;

        @Schema(description = "Estimated annual revenue of the competitor, e.g. $38M")
        private String revenue;

        @Schema(description = "Estimated year-over-year growth rate, e.g. +8%")
        private String growth;

        @Schema(description = "Competitive position: Direct or Indirect")
        private String position;
    }

    public static MarketAnalysisResponseDTO from(MarketAnalysis analysis, List<CompetitorAnalysis> competitors) {
        MarketAnalysisResponseDTO dto = MarketAnalysisResponseDTO.builder()
                .id(analysis.getId())
                .projectId(analysis.getProject().getProjectId())
                .marketSizeTam(analysis.getMarketSizeTam())
                .marketSizeSam(analysis.getMarketSizeSam())
                .marketSizeSom(analysis.getMarketSizeSom())
                .growthRate(analysis.getGrowthRate())
                .marketTrendsJson(analysis.getMarketTrendsJson())
                .createdAt(analysis.getCreatedAt())
                .build();

        dto.setCompetitors(competitors.stream()
                .map(c -> CompetitorDTO.builder()
                        .id(c.getId())
                        .competitorName(c.getCompetitorName())
                        .marketShare(c.getMarketShare())
                        .revenue(c.getRevenue())
                        .growth(c.getGrowth())
                        .position(c.getPosition())
                        .build())
                .toList());

        return dto;
    }
}