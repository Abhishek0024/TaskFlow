package com.taskflow.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class ProjectResponse {
    private Long id;
    private String title;
    private String description;
    private Long createdBy;
    private List<Long> memberIds;
    private List<String> memberNames;
}
