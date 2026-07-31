package com.startsmart.ai.riskanalyzer.repository;

import com.startsmart.ai.riskanalyzer.entity.CompetitorAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CompetitorAnalysisRepository extends JpaRepository<CompetitorAnalysis, Long> {
    List<CompetitorAnalysis> findByProjectProjectId(Long projectId);

    void deleteByProjectProjectId(Long projectId);
}