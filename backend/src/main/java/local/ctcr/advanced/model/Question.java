package local.ctcr.advanced.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

/**
 * Updated Question — adds type enum, correctAnswer, hint, explanation,
 * points, and ordering. Merge these fields into your existing Question entity.
 *
 * IMPORTANT: correctAnswer is never serialized to JSON (see @JsonIgnore below).
 * Answer validation happens server-side in AnswerService only.
 */
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

    // "back" side — lesson field suppressed to avoid Lesson→Question→Lesson loop
    @JsonBackReference("lesson-questions")
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

    // WRITE_ONLY — accepted from admin requests but never returned in responses
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
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

    @JsonIgnore
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<UserAnswer> answers;

    public enum QuestionType {
        MULTIPLE_CHOICE,
        FREE_TEXT,
        FLAG_SUBMISSION   // e.g. THM{answer_here}
    }
}