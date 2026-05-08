package local.ctcr.advanced.controller;

import local.ctcr.advanced.dto.AnswerSubmitRequest;
import local.ctcr.advanced.dto.AnswerResponse;
import local.ctcr.advanced.model.Question;
import local.ctcr.advanced.model.User;
import local.ctcr.advanced.service.AnswerService;
import local.ctcr.advanced.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;
    private final AnswerService answerService;

    // ── Public ────────────────────────────────────────────────────────────────

    /**
     * GET /api/questions/lesson/{lessonId}
     * Returns all questions for a lesson ordered by displayOrder.
     * correctAnswer is excluded via @JsonIgnore on the entity.
     */
    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<List<Question>> getQuestionsByLesson(@PathVariable Long lessonId) {
        return ResponseEntity.ok(questionService.getQuestionsByLesson(lessonId));
    }

    // ── Authenticated ─────────────────────────────────────────────────────────

    /**
     * POST /api/questions/{questionId}/answer
     * Submit an answer. The correct answer is never returned —
     * only correct/incorrect, points, explanation, and optional hint.
     */
    @PostMapping("/{questionId}/answer")
    public ResponseEntity<AnswerResponse> submitAnswer(
            @PathVariable Long questionId,
            @Valid @RequestBody AnswerSubmitRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        request.setQuestionId(questionId);
        Long userId = ((User) userDetails).getId();
        return ResponseEntity.ok(answerService.submitAnswer(userId, request));
    }

    // ── Admin only ────────────────────────────────────────────────────────────

    /**
     * POST /api/questions
     * Create a new question. Body must include a lesson: { id: X } reference.
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Question> createQuestion(@RequestBody Question question) {
        return ResponseEntity.ok(questionService.createQuestion(question));
    }

    /**
     * PUT /api/questions/{id}
     * Update an existing question.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Question> updateQuestion(
            @PathVariable Long id,
            @RequestBody Question question) {
        return ResponseEntity.ok(questionService.updateQuestion(id, question));
    }

    /**
     * DELETE /api/questions/{id}
     * Delete a question and its associated user answers.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }
}