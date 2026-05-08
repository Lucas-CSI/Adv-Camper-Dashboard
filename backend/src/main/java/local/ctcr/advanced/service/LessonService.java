package local.ctcr.advanced.service;

import local.ctcr.advanced.model.Lesson;
import local.ctcr.advanced.model.Module;
import local.ctcr.advanced.repository.LessonRepository;
import local.ctcr.advanced.repository.ModuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LessonService {

    private final LessonRepository lessonRepository;
    private final ModuleRepository moduleRepository;

    public Lesson getLessonById(Long id) {
        return lessonRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found: " + id));
    }

    public List<Lesson> getLessonsByModule(Long moduleId) {
        return lessonRepository.findByModuleIdOrderByDisplayOrderAsc(moduleId);
    }

    @Transactional
    public Lesson createLesson(Lesson lesson) {
        if (lesson.getModule() != null && lesson.getModule().getId() != null) {
            Module module = moduleRepository.findById(lesson.getModule().getId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Module not found: " + lesson.getModule().getId()));
            lesson.setModule(module);
        }
        return lessonRepository.save(lesson);
    }

    @Transactional
    public Lesson updateLesson(Long id, Lesson updated) {
        Lesson existing = getLessonById(id);
        existing.setTitle(updated.getTitle());
        existing.setContent(updated.getContent());
        existing.setDifficulty(updated.getDifficulty());
        existing.setDisplayOrder(updated.getDisplayOrder());
        existing.setEstimatedMinutes(updated.getEstimatedMinutes());
        existing.setPoints(updated.getPoints());

        // Allow re-parenting to a different module
        if (updated.getModule() != null && updated.getModule().getId() != null) {
            Module module = moduleRepository.findById(updated.getModule().getId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Module not found: " + updated.getModule().getId()));
            existing.setModule(module);
        }

        return lessonRepository.save(existing);
    }

    @Transactional
    public void deleteLesson(Long id) {
        if (!lessonRepository.existsById(id)) {
            throw new IllegalArgumentException("Lesson not found: " + id);
        }
        lessonRepository.deleteById(id);
    }
}