package local.ctcr.advanced.dto;

import jakarta.validation.constraints.NotBlank;
import local.ctcr.advanced.model.User;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank
    private String username;

    @NotBlank
    private String password;
}

