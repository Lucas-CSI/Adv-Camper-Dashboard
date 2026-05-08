package local.ctcr.advanced.service;

import local.ctcr.advanced.dto.AnswerResponse;
import local.ctcr.advanced.dto.AnswerSubmitRequest;
import local.ctcr.advanced.model.*;
import local.ctcr.advanced.repository.*;
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

    private static final int HINT_AFTER_ATTEMPTS = 2;

    @Transactional
    public AnswerResponse submitAnswer(Long userId, AnswerSubmitRequest request) {
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

        // Check if the lesson is now fully completed
        boolean lessonCompleted = false;
        if (isCorrect) {
            lessonCompleted = checkAndCompleteLesson(user, question, pointsAwarded);
        }

        AnswerResponse response = new AnswerResponse();
        response.setCorrect(isCorrect);
        response.setPointsAwarded(pointsAwarded);
        response.setAttemptNumber(attemptCount + 1);
        response.setLessonCompleted(lessonCompleted);
        response.setExplanation(question.getExplanation());

        // Reveal hint after enough wrong attempts
        if (!isCorrect && (attemptCount + 1) >= HINT_AFTER_ATTEMPTS) {
            response.setHint(question.getHint());
        }

        return response;
    }

    private boolean validate(Question question, String answerGiven) {
        if (answerGiven == null) return false;
        String correct = question.getCorrectAnswer().trim();
        String given = answerGiven.trim();
        return switch (question.getType()) {
            case FLAG_SUBMISSION -> correct.equalsIgnoreCase(given);
            case MULTIPLE_CHOICE -> correct.equalsIgnoreCase(given);
            case FREE_TEXT       -> correct.equalsIgnoreCase(given);
        };
    }

    private boolean checkAndCompleteLesson(User user, Question question, int pointsForThisAnswer) {
        Lesson lesson = question.getLesson();
        long totalQuestions = lesson.getQuestions().size();
        long correctlyAnswered = lesson.getQuestions().stream()
                .filter(q -> userAnswerRepository
                        .existsByUserIdAndQuestionIdAndCorrectTrue(user.getId(), q.getId()))
                .count();

        if (correctlyAnswered < totalQuestions) return false;

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