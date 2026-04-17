package local.ctcr.advanced.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "user_progress",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "lesson_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Status status = Status.NOT_STARTED;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    // Points earned for completing this lesson
    @Column(name = "points_earned")
    @Builder.Default
    private Integer pointsEarned = 0;

    public enum Status {
        NOT_STARTED, IN_PROGRESS, COMPLETED
    }

    public void markStarted() {
        if (this.status == Status.NOT_STARTED) {
            this.status = Status.IN_PROGRESS;
            this.startedAt = LocalDateTime.now();
        }
    }

    public void markCompleted(int points) {
        this.status = Status.COMPLETED;
        this.completedAt = LocalDateTime.now();
        this.pointsEarned = points;
    }
}