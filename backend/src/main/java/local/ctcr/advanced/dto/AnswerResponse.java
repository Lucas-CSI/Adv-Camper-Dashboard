package local.ctcr.advanced.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

// ─── AnswerResponse ───────────────────────────────────────────────────────────
// Returned after answer submission — never exposes the raw correct answer
@Data
public class AnswerResponse {
    private boolean correct;
    private int pointsAwarded;
    private int attemptNumber;
    private String explanation;      // Shown after answering (correct or wrong)
    private String hint;             // Optional: shown after X wrong attempts
    private boolean lessonCompleted; // true if this was the last question in the lesson
}
