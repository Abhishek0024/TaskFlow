package com.taskflow.backend.service;

import com.taskflow.backend.dto.TaskRequest;
import com.taskflow.backend.dto.TaskResponse;
import com.taskflow.backend.entity.ActivityType;
import com.taskflow.backend.entity.Project;
import com.taskflow.backend.entity.Task;
import com.taskflow.backend.entity.TaskStatus;
import com.taskflow.backend.entity.User;
import com.taskflow.backend.entity.Role;
import com.taskflow.backend.repository.ProjectRepository;
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
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;

    public TaskResponse createTask(TaskRequest request, String userEmail) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (currentUser.getRole() != Role.ADMIN && !isProjectMember(project, currentUser)) {
            throw new RuntimeException("You can only create tasks in projects you belong to");
        }

        User assignedUser = null;
        if (currentUser.getRole() != Role.ADMIN) {
            if (request.getAssignedUserId() != null && !request.getAssignedUserId().equals(currentUser.getId())) {
                throw new RuntimeException("Members can only assign new tasks to themselves");
            }
            assignedUser = currentUser;
        } else if (request.getAssignedUserId() != null) {
            assignedUser = userRepository.findById(request.getAssignedUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO)
                .deadline(request.getDeadline())
                .project(project)
                .assignedUser(assignedUser)
                .build();

        task = taskRepository.save(task);
        activityLogService.record(
                ActivityType.TASK_CREATED,
                currentUser.getName() + " created task " + task.getTitle() + " in " + project.getTitle(),
                project,
                currentUser
        );
        return mapToResponse(task);
    }

    public List<TaskResponse> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<TaskResponse> getTasksByProject(Long projectId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (user.getRole() != Role.ADMIN && !isProjectMember(project, user)) {
            throw new RuntimeException("You can only view tasks for projects you belong to");
        }

        return taskRepository.findByProjectId(projectId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TaskResponse updateTaskStatus(Long taskId, TaskStatus status, String userEmail) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Role.ADMIN && !isProjectMember(task.getProject(), user)) {
            throw new RuntimeException("You can only update tasks for projects you belong to");
        }

        TaskStatus previousStatus = task.getStatus();
        task.setStatus(status);
        task = taskRepository.save(task);

        if (previousStatus != status) {
            activityLogService.record(
                    ActivityType.TASK_STATUS_CHANGED,
                    user.getName() + " moved " + task.getTitle() + " from " + previousStatus + " to " + status,
                    task.getProject(),
                    user
            );
        }
        return mapToResponse(task);
    }

    private TaskResponse mapToResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .deadline(task.getDeadline())
                .projectId(task.getProject().getId())
                .assignedUserId(task.getAssignedUser() != null ? task.getAssignedUser().getId() : null)
                .build();
    }

    private boolean isProjectMember(Project project, User user) {
        return project.getMembers() != null
                && project.getMembers().stream().anyMatch(member -> member.getId().equals(user.getId()));
    }
}
