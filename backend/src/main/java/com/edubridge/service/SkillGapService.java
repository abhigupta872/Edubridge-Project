package com.edubridge.service;

import com.edubridge.dto.SkillGapReportDto;

public interface SkillGapService {
    SkillGapReportDto generateSkillGapReport(Long studentId, Long positionId, boolean isInternship);
}
