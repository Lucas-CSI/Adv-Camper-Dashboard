package local.ctcr.advanced.service;

import com.example.dto.AnswerDTOs.AnswerResponse;
import com.example.dto.AnswerDTOs.AnswerSubmitRequest;
import com.example.model.*;
import com.example.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AnswerService {

    private final UserAnswerRepository userAnswerRepository;
    private final UserProgressRepository userProgressRepository;
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;

    private static final int HINT_AFTER_ATTEMPTS = 2; // show hint after 2 wrong tries

    @Transactional
    public AnswerResponse submitAnswer(Long userId, AnswerSubmitRequest request) {
        // Load user and question (replace with your actual Question fetch)
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new IllegalArgumentException("Question not found"));

        boolean alreadyCorrect = userAnswerRepository
                .existsByUserIdAndQuestionIdAndCorrectTrue(userId, request.getQuestionId());

        int attemptCount = userAnswerRepository
                .countAttempts(userId, request.getQuestionId());

        boolean isCorrect = validate(question, request.getAnswerGiven());
        int pointsAwarded = 0;

        // Only award points on the FIRST correct attempt
        if (isCorrect && !alreadyCorrect) {
            pointsAwarded = question.getPoints();
            user.setTotalPoints(user.getTotalPoints() + pointsAwarded);
            userRepository.save(user);
        }

        // Persist the attempt
        UserAnswer answer = UserAnswer.builder()
                .user(user)
                .question(question)
                .answerGiven(request.getAnswerGiven())
                .correct(isCorrect)
                .attemptNumber(attemptCount + 1)
                .pointsAwarded(pointsAwarded)
                .build();
        userAnswerRepository.save(answer);

        // Update lesson progress if the lesson is now fully answered correctly
        boolean lessonCompleted = false;
        if (isCorrect) {
            lessonCompleted = checkAndCompletLesson(user, question, pointsAwarded);
        }

        // Build response
        AnswerResponse response = new AnswerResponse();
        response.setCorrect(isCorrect);
        response.setPointsAwarded(pointsAwarded);
        response.setAttemptNumber(attemptCount + 1);
        response.setLessonCompleted(lessonCompleted);

        // Show explanation after any answer
        response.setExplanation(question.getExplanation());

        // Show hint after enough wrong attempts
        if (!isCorrect && attemptCount + 1 >= HINT_AFTER_ATTEMPTS) {
            response.setHint(question.getHint());
        }

        return response;
    }

    /**
     * Validates the user's answer against the stored correct answer.
     * Extend this method to handle different question types (e.g. multiple choice, flag, free text).
     */
    private boolean validate(Question question, String answerGiven) {
        if (question == null || answerGiven == null) return false;

        String correct = question.getCorrectAnswer().trim();
        String given = answerGiven.trim();

        return switch (question.getType()) {
            // Flag: THM{...} — case-insensitive exact match
            case FLAG_SUBMISSION -> correct.equalsIgnoreCase(given);
            // Multiple choice: match the stored option ID or text
            case MULTIPLE_CHOICE -> correct.equalsIgnoreCase(given);
            // Free text: normalize whitespace and case
            case FREE_TEXT -> correct.equalsIgnoreCase(given);
        };
    }

    /**
     * Checks if all questions in the lesson have been answered correctly,
     * and marks the lesson as completed if so.
     */
    private boolean checkAndCompletLesson(User user, Question question, int pointsForThisAnswer) {
        Lesson lesson = question.getLesson();

        long totalQuestions = lesson.getQuestions().size();
        long correctlyAnswered = lesson.getQuestions().stream()
                .filter(q -> userAnswerRepository
                        .existsByUserIdAndQuestionIdAndCorrectTrue(user.getId(), q.getId()))
                .count();

        if (correctlyAnswered < totalQuestions) return false;

        // All questions answered — mark lesson complete
        UserProgress progress = userProgressRepository
                .findByUserIdAndLessonId(user.getId(), lesson.getId())
                .orElse(UserProgress.builder().user(user).lesson(lesson).build());

        if (progress.getStatus() != UserProgress.Status.COMPLETED) {
            progress.markCompleted(pointsForThisAnswer);
            userProgressRepository.save(progress);
        }

        return true;
    }
}