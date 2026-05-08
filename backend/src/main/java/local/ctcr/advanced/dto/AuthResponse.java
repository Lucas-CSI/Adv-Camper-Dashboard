package local.ctcr.advanced.dto;

import local.ctcr.advanced.model.User;
import lombok.Data;

@Data
public class AuthResponse {

    private String token;
    private String username;
    private String role;
    private Integer totalPoints;

    public AuthResponse(String token, User user) {
        this.token = token;
        this.username = user.getUsername();
        this.role = "ROLE_" + user.getRole().name();
        this.totalPoints = user.getTotalPoints();
    }
}
