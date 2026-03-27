package com.example.repository;

import com.example.model.UserAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserAnswerRepository extends JpaRepository<UserAnswer, Long> {

    List<UserAnswer> findByUserIdAndQuestionId(Long userId, Long questionId);

    // Check if the user has already answered this question correctly
    boolean existsByUserIdAndQuestionIdAndCorrectTrue(Long userId, Long questionId);

    // Get total attempt count for rate-limiting hint requests or retry caps
    @Query("""
        SELECT COUNT(ua) FROM UserAnswer ua
        WHERE ua.user.id = :userId AND ua.question.id = :questionId
    """)
    int countAttempts(@Param("userId") Long userId, @Param("questionId") Long questionId);

    // Fetch all answers for a user in a specific lesson (for progress review)
    @Query("""
        SELECT ua FROM UserAnswer ua
        WHERE ua.user.id = :userId AND ua.question.lesson.id = :lessonId
        ORDER BY ua.attemptedAt ASC
    """)
    List<UserAnswer> findByUserIdAndLessonId(@Param("userId") Long userId,
                                             @Param("lessonId") Long lessonId);

    // Most recent answer per question for a user
    @Query("""
        SELECT ua FROM UserAnswer ua
        WHERE ua.user.id = :userId AND ua.question.id = :questionId
        ORDER BY ua.attemptedAt DESC
    """)
    Optional<UserAnswer> findLatestByUserIdAndQuestionId(@Param("userId") Long userId,
                                                         @Param("questionId") Long questionId);
}