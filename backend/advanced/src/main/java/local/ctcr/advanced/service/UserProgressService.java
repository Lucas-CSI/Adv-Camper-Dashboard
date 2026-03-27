package local.ctcr.advanced.service;

import com.example.model.Lesson;
import com.example.model.User;
import com.example.model.UserProgress;
import com.example.repository.UserProgressRepository;
import com.example.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserProgressService {

    private final UserProgressRepository userProgressRepository;
    private final UserRepository userRepository;
    // Inject your LessonRepository here:
    // private final LessonRepository lessonRepository;

    /**
     * Called when a user opens a lesson for the first time.
     * Creates a UserProgress record in IN_PROGRESS state.
     */
    @Transactional
    public UserProgress startLesson(Long userId, Long lessonId) {
        // Return existing progress if already started
        return userProgressRepository
                .findByUserIdAndLessonId(userId, lessonId)
                .map(existing -> {
                    existing.markStarted(); // no-op if already IN_PROGRESS or COMPLETED
                    return userProgressRepository.save(existing);
                })
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new IllegalArgumentException("User not found"));

                    // Lesson lesson = lessonRepository.findById(lessonId)
                    //         .orElseThrow(() -> new IllegalArgumentException("Lesson not found"));
                    Lesson lesson = null; // TODO: replace with real fetch

                    UserProgress progress = UserProgress.builder()
                            .user(user)
                            .lesson(lesson)
                            .build();
                    progress.markStarted();
                    return userProgressRepository.save(progress);
                });
    }

    /**
     * Returns all progress records for a user — useful for the dashboard.
     */
    public List<UserProgress> getAllProgressForUser(Long userId) {
        return userProgressRepository.findByUserId(userId);
    }

    /**
     * Returns only the completed lessons for a user.
     */
    public List<UserProgress> getCompletedLessons(Long userId) {
        return userProgressRepository.findByUserIdAndStatus(userId, UserProgress.Status.COMPLETED);
    }

    /**
     * Returns progress for a specific lesson, or a NOT_STARTED stub if none exists.
     */
    public UserProgress getProgressForLesson(Long userId, Long lessonId) {
        return userProgressRepository
                .findByUserIdAndLessonId(userId, lessonId)
                .orElse(UserProgress.builder()
                        .status(UserProgress.Status.NOT_STARTED)
                        .build());
    }

    /**
     * Checks whether a user has completed every lesson in a module.
     */
    public boolean hasCompletedModule(Long userId, Long moduleId) {
        return userProgressRepository.hasCompletedAllLessonsInModule(userId, moduleId);
    }
}