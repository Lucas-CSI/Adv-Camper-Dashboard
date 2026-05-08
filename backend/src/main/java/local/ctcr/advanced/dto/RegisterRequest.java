package local.ctcr.advanced.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank
    @Size(min = 3, max = 30)
    private String username;


    @NotBlank
    @Size(min = 8)
    private String password;
}
