package com.taskflow.backend.dto;

import com.taskflow.backend.entity.TaskStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private LocalDate deadline;
    private Long projectId;
    private Long assignedUserId;
}
