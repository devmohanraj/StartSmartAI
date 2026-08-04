package com.startsmart.ai.riskanalyzer.repository;

import com.startsmart.ai.riskanalyzer.entity.MarketAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MarketAnalysisRepository extends JpaRepository<MarketAnalysis, Long> {
    Optional<MarketAnalysis> findByProjectProjectId(Long projectId);
    void deleteByProjectProjectId(Long projectId);
}
