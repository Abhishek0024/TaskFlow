package com.taskflow.backend.dto;

import com.taskflow.backend.entity.ActivityType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ActivityLogResponse {
    private Long id;
    private ActivityType type;
    private String message;
    private LocalDateTime createdAt;
    private Long projectId;
    private String projectTitle;
    private Long actorId;
    private String actorName;
}
