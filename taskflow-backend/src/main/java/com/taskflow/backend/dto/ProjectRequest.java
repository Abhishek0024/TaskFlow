package com.taskflow.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class ProjectRequest {
    @NotBlank
    private String title;
    
    private String description;
}
