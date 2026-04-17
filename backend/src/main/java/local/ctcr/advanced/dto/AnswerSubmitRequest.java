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
