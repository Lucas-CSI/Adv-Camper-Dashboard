package local.ctcr.advanced.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AnswerSubmitRequest {

    @NotNull
    private Long questionId;

    @NotBlank
    private String answerGiven;
}
