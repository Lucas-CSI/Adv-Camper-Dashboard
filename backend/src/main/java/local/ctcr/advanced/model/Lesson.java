package local.ctcr.advanced.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "lessons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    // Markdown-formatted lesson body rendered on the frontend
    @Column(columnDefinition = "TEXT")
    private String content;

    // "back" side — module field is suppressed to avoid Module→Lesson→Module loop
    @JsonBackReference("module-lessons")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "module_id", nullable = false)
    private Module module;

    // Order within the module (1-indexed)
    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private Integer displayOrder = 1;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Difficulty difficulty = Difficulty.EASY;

    @Column(name = "estimated_minutes")
    @Builder.Default
    private Integer estimatedMinutes = 10;

    // Points a student earns for completing this lesson
    @Column(nullable = false)
    @Builder.Default
    private Integer points = 100;

    @JsonManagedReference("lesson-questions")
    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("displayOrder ASC")
    private List<Question> questions;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<UserProgress> progressRecords;

    // Expose moduleId in JSON even though full module object is suppressed
    public Long getModuleId() {
        return module != null ? module.getId() : null;
    }

    public enum Difficulty {
        EASY, MEDIUM, HARD
    }
}