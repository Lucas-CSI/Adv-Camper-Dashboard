package local.ctcr.advanced.controller;

import local.ctcr.advanced.model.User;
import local.ctcr.advanced.model.UserProgress;
import local.ctcr.advanced.service.UserProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class UserProgressController {

    private final UserProgressService userProgressService;

    /**
     * GET /api/progress
     * Returns all progress records for the currently authenticated user.
     * Used to populate the dashboard.
     */
    @GetMapping
    public ResponseEntity<List<UserProgress>> getAllProgress(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = ((User) userDetails).getId();
        return ResponseEntity.ok(userProgressService.getAllProgressForUser(userId));
    }

    /**
     * GET /api/progress/completed
     * Returns only the lessons a user has fully completed.
     */
    @GetMapping("/completed")
    public ResponseEntity<List<UserProgress>> getCompletedLessons(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = ((User) userDetails).getId();
        return ResponseEntity.ok(userProgressService.getCompletedLessons(userId));
    }

    /**
     * GET /api/progress/lessons/{lessonId}
     * Returns progress for a single lesson (NOT_STARTED stub if never opened).
     */
    @GetMapping("/lessons/{lessonId}")
    public ResponseEntity<UserProgress> getLessonProgress(
            @PathVariable Long lessonId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = ((User) userDetails).getId();
        return ResponseEntity.ok(userProgressService.getProgressForLesson(userId, lessonId));
    }

    /**
     * POST /api/progress/lessons/{lessonId}/start
     * Call this when a user opens a lesson. Creates or updates progress to IN_PROGRESS.
     */
    @PostMapping("/lessons/{lessonId}/start")
    public ResponseEntity<UserProgress> startLesson(
            @PathVariable Long lessonId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = ((User) userDetails).getId();
        return ResponseEntity.ok(userProgressService.startLesson(userId, lessonId));
    }

    /**
     * GET /api/progress/modules/{moduleId}/completed
     * Returns true if the user has completed every lesson in the module.
     */
    @GetMapping("/modules/{moduleId}/completed")
    public ResponseEntity<Boolean> isModuleCompleted(
            @PathVariable Long moduleId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = ((User) userDetails).getId();
        return ResponseEntity.ok(userProgressService.hasCompletedModule(userId, moduleId));
    }
}