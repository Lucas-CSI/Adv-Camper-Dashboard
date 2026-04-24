package local.ctcr.advanced.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1000)
    private String text;

    // The lesson this question belongs to
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private QuestionType type = QuestionType.FREE_TEXT;

    // For MULTIPLE_CHOICE: store options as a JSON string, e.g. ["Option A","Option B","Option C"]
    // For FLAG_SUBMISSION / FREE_TEXT: leave null
    @Column(columnDefinition = "TEXT")
    private String options;

    /**
     * The correct answer — NEVER expose this in API responses.
     * Add @JsonIgnore (Jackson) or @JsonProperty(access = WRITE_ONLY) here.
     * Validation happens only in AnswerService.validate().
     */
    @com.fasterxml.jackson.annotation.JsonIgnore
    @Column(name = "correct_answer", nullable = false)
    private String correctAnswer;

    // Shown to the user after they answer (correct or wrong)
    @Column(length = 2000)
    private String explanation;

    // Shown after HINT_AFTER_ATTEMPTS wrong attempts (see AnswerService)
    @Column(length = 1000)
    private String hint;

    // Points awarded for a first-time correct answer
    @Column(nullable = false)
    @Builder.Default
    private Integer points = 10;

    // Order within the lesson
    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private Integer displayOrder = 1;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<UserAnswer> answers;

    public enum QuestionType {
        MULTIPLE_CHOICE,
        FREE_TEXT,
        FLAG_SUBMISSION   // e.g. THM{answer_here}
    }
}