package com.taskflow.backend.service;

import com.taskflow.backend.dto.ProjectRequest;
import com.taskflow.backend.dto.ProjectResponse;
import com.taskflow.backend.entity.ActivityType;
import com.taskflow.backend.entity.Project;
import com.taskflow.backend.entity.Role;
import com.taskflow.backend.entity.User;
import com.taskflow.backend.repository.ProjectRepository;
import com.taskflow.backend.repository.ActivityLogRepository;
import com.taskflow.backend.repository.TaskRepository;
import com.taskflow.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final ActivityLogRepository activityLogRepository;
    private final ActivityLogService activityLogService;

    public ProjectResponse createProject(ProjectRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = Project.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .createdBy(user.getId())
                .build();

        project = projectRepository.save(project);
        activityLogService.record(
                ActivityType.PROJECT_CREATED,
                user.getName() + " created project " + project.getTitle(),
                project,
                user
        );

        return mapToResponse(project);
    }

    public List<ProjectResponse> getProjectsForUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Project> projects = user.getRole() == Role.ADMIN
                ? projectRepository.findAll()
                : projectRepository.findDistinctByMembersId(user.getId());

        return projects.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void addMember(Long projectId, Long userId, String actorEmail) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User actor = userRepository.findByEmail(actorEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (project.getMembers() == null) {
            project.setMembers(new java.util.HashSet<>());
        }
        project.getMembers().add(user);
        projectRepository.save(project);
        activityLogService.record(
                ActivityType.MEMBER_ADDED,
                actor.getName() + " added " + user.getName() + " to " + project.getTitle(),
                project,
                actor
        );
    }

    public void deleteProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (project.getMembers() != null) {
            project.getMembers().clear();
            projectRepository.save(project);
        }

        activityLogRepository.deleteByProjectId(projectId);
        taskRepository.deleteByProjectId(projectId);
        projectRepository.delete(project);
    }

    private ProjectResponse mapToResponse(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .createdBy(project.getCreatedBy())
                .memberIds(project.getMembers() == null ? List.of() : project.getMembers().stream()
                        .map(User::getId)
                        .collect(Collectors.toList()))
                .memberNames(project.getMembers() == null ? List.of() : project.getMembers().stream()
                        .map(User::getName)
                        .collect(Collectors.toList()))
                .build();
    }
}
