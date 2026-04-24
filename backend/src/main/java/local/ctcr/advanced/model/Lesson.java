package local.ctcr.advanced.model;

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

    // The module this lesson belongs to
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

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("displayOrder ASC")
    private List<Question> questions;

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<UserProgress> progressRecords;

    public enum Difficulty {
        EASY, MEDIUM, HARD
    }
}