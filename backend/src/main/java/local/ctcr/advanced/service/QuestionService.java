package local.ctcr.advanced.service;

import local.ctcr.advanced.model.Lesson;
import local.ctcr.advanced.model.Question;
import local.ctcr.advanced.repository.LessonRepository;
import local.ctcr.advanced.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final LessonRepository lessonRepository;

    public Question getQuestionById(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Question not found: " + id));
    }

    public List<Question> getQuestionsByLesson(Long lessonId) {
        return questionRepository.findByLessonIdOrderByDisplayOrderAsc(lessonId);
    }

    @Transactional
    public Question createQuestion(Question question) {
        // Resolve the lesson reference from its ID
        if (question.getLesson() != null && question.getLesson().getId() != null) {
            Lesson lesson = lessonRepository.findById(question.getLesson().getId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Lesson not found: " + question.getLesson().getId()));
            question.setLesson(lesson);
        }
        return questionRepository.save(question);
    }

    @Transactional
    public Question updateQuestion(Long id, Question updated) {
        Question existing = getQuestionById(id);
        existing.setText(updated.getText());
        existing.setType(updated.getType());
        existing.setOptions(updated.getOptions());
        existing.setCorrectAnswer(updated.getCorrectAnswer());
        existing.setExplanation(updated.getExplanation());
        existing.setHint(updated.getHint());
        existing.setPoints(updated.getPoints());
        existing.setDisplayOrder(updated.getDisplayOrder());

        // Allow re-parenting to a different lesson
        if (updated.getLesson() != null && updated.getLesson().getId() != null) {
            Lesson lesson = lessonRepository.findById(updated.getLesson().getId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Lesson not found: " + updated.getLesson().getId()));
            existing.setLesson(lesson);
        }

        return questionRepository.save(existing);
    }

    @Transactional
    public void deleteQuestion(Long id) {
        if (!questionRepository.existsById(id)) {
            throw new IllegalArgumentException("Question not found: " + id);
        }
        questionRepository.deleteById(id);
    }
}