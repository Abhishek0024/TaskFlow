package com.taskflow.backend.controller;

import com.taskflow.backend.dto.ActivityLogResponse;
import com.taskflow.backend.service.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/activity")
@RequiredArgsConstructor
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    @GetMapping("/recent")
    public ResponseEntity<List<ActivityLogResponse>> getRecent(Authentication authentication) {
        return ResponseEntity.ok(activityLogService.getRecentForUser(authentication.getName()));
    }
}
