package com.taskflow.backend.dto;

import com.taskflow.backend.entity.TaskStatus;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
public class TaskRequest {
    @NotBlank
    private String title;
    
    private String description;
    
    private TaskStatus status;
    
    private LocalDate deadline;
    
    @NotNull
    private Long projectId;
    
    private Long assignedUserId;
}
