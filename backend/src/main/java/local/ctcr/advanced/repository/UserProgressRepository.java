package local.ctcr.advanced.repository;

import local.ctcr.advanced.model.UserProgress;
import local.ctcr.advanced.model.UserProgress.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {

    Optional<UserProgress> findByUserIdAndLessonId(Long userId, Long lessonId);

    List<UserProgress> findByUserId(Long userId);

    List<UserProgress> findByUserIdAndStatus(Long userId, Status status);

    // Count how many lessons in a module a user has completed
    @Query("""
        SELECT COUNT(up) FROM UserProgress up
        WHERE up.user.id = :userId
          AND up.lesson.module.id = :moduleId
          AND up.status = 'COMPLETED'
    """)
    long countCompletedLessonsInModule(@Param("userId") Long userId,
                                       @Param("moduleId") Long moduleId);

    // Check if a user has completed all lessons in a module
    @Query("""
        SELECT COUNT(l) = COUNT(up)
        FROM Lesson l
        LEFT JOIN UserProgress up
            ON up.lesson.id = l.id AND up.user.id = :userId AND up.status = 'COMPLETED'
        WHERE l.module.id = :moduleId
    """)
    boolean hasCompletedAllLessonsInModule(@Param("userId") Long userId,
                                           @Param("moduleId") Long moduleId);
}
