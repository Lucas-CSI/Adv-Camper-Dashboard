package local.ctcr.advanced.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

// ─── AnswerSubmitRequest ──────────────────────────────────────────────────────
// Used by POST /api/questions/{questionId}/answer
@Data
public class AnswerSubmitRequest {

    @NotNull
    private Long questionId;

    @NotBlank
    private String answerGiven;
}

// ─── AnswerResponse ───────────────────────────────────────────────────────────
// Returned after answer submission — never exposes the raw correct answer
@Data
class AnswerResponse {
    private boolean correct;
    private int pointsAwarded;
    private int attemptNumber;
    private String explanation;      // Shown after answering (correct or wrong)
    private String hint;             // Optional: shown after X wrong attempts
    private boolean lessonCompleted; // true if this was the last question in the lesson
}
