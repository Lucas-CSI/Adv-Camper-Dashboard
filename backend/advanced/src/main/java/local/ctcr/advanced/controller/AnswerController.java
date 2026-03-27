package local.ctcr.advanced.controller;

import com.example.dto.AnswerDTOs.AnswerResponse;
import com.example.dto.AnswerDTOs.AnswerSubmitRequest;
import com.example.model.User;
import com.example.service.AnswerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class AnswerController {

    private final AnswerService answerService;

    /**
     * POST /api/questions/{questionId}/answer
     * Submit an answer for a specific question.
     *
     * The correct answer is NEVER returned — only correct/incorrect + explanation.
     */
    @PostMapping("/{questionId}/answer")
    public ResponseEntity<AnswerResponse> submitAnswer(
            @PathVariable Long questionId,
            @Valid @RequestBody AnswerSubmitRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        // Ensure the path variable and body are consistent
        request.setQuestionId(questionId);

        Long userId = ((User) userDetails).getId();
        return ResponseEntity.ok(answerService.submitAnswer(userId, request));
    }
}