package local.ctcr.advanced.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AnswerResponse {
    private boolean correct;
    private int pointsAwarded;
    private int attemptNumber;
    private String explanation;
    private String hint;
    private boolean lessonCompleted;
}
