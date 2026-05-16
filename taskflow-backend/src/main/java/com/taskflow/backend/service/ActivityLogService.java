package com.taskflow.backend.service;

import com.taskflow.backend.dto.ActivityLogResponse;
import com.taskflow.backend.entity.ActivityLog;
import com.taskflow.backend.entity.ActivityType;
import com.taskflow.backend.entity.Project;
import com.taskflow.backend.entity.Role;
import com.taskflow.backend.entity.User;
import com.taskflow.backend.repository.ActivityLogRepository;
import com.taskflow.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;
    private final UserRepository userRepository;

    public void record(ActivityType type, String message, Project project, User actor) {
        ActivityLog log = ActivityLog.builder()
                .type(type)
                .message(message)
                .project(project)
                .actor(actor)
                .createdAt(LocalDateTime.now())
                .build();

        activityLogRepository.save(log);
    }

    public List<ActivityLogResponse> getRecentForUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<ActivityLog> logs = user.getRole() == Role.ADMIN
                ? activityLogRepository.findTop10ByOrderByCreatedAtDesc()
                : activityLogRepository.findDistinctTop10ByProjectMembersIdOrderByCreatedAtDesc(user.getId());

        return logs.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ActivityLogResponse mapToResponse(ActivityLog log) {
        return ActivityLogResponse.builder()
                .id(log.getId())
                .type(log.getType())
                .message(log.getMessage())
                .createdAt(log.getCreatedAt())
                .projectId(log.getProject() != null ? log.getProject().getId() : null)
                .projectTitle(log.getProject() != null ? log.getProject().getTitle() : null)
                .actorId(log.getActor() != null ? log.getActor().getId() : null)
                .actorName(log.getActor() != null ? log.getActor().getName() : null)
                .build();
    }
}
