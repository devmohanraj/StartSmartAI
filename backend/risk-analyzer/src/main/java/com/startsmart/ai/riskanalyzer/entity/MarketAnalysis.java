package com.startsmart.ai.riskanalyzer.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "market_analyses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarketAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    private BigDecimal marketSizeTam;

    private BigDecimal marketSizeSam;

    private BigDecimal marketSizeSom;

    private String growthRate;

    @Column(columnDefinition = "TEXT")
    private String marketTrendsJson;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}