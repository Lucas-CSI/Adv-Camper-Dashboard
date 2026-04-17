package local.ctcr.advanced.repository;

import local.ctcr.advanced.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByLessonIdOrderByDisplayOrderAsc(Long lessonId);

    long countByLessonId(Long lessonId);
}