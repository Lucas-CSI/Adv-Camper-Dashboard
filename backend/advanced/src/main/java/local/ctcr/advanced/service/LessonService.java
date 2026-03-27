package local.ctcr.advanced.service;

import local.ctcr.advanced.model.Lesson;
import local.ctcr.advanced.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LessonService {
    private LessonRepository lessonRepository;

    @Autowired
    public LessonService(LessonRepository lessonRepository) {
        this.lessonRepository = lessonRepository;
    }

    public Lesson getLesson(Long id) {
        Optional<Lesson> lesson = lessonRepository.findById(id);

        return lesson.orElse(null);
    }
}
