package seb.project.Codetech.question.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import seb.project.Codetech.question.entity.Question;
import seb.project.Codetech.question.respository.QuestionRepository;
import seb.project.Codetech.user.service.UserService;

@Service
@Transactional
@RequiredArgsConstructor
public class QuestionService {
	private final QuestionRepository questionRepository;
	private final UserService userService;

	public Long createQuestion(String email, String content) {
		Question question = Question.from(content);
		question.setWriter(userService.findUser(email));

		return questionRepository.save(question).getId();
	}

	public Long updateQuestion(Long id, String content) {
		Question question = findVerifiedOne(id);
		question.checkUpdatable();

		question.updateContent(content);

		return question.getId();
	}

	public void deleteQuestion(Long id) {
		Question question = findVerifiedOne(id);
		if (question.isDeletable()) {
			questionRepository.delete(question);
			return;
		}

		question.updateToDeleted();
	}

	@Transactional(readOnly = true)
	public Question findVerifiedOne(Long id) {
		Optional<Question> found = questionRepository.findById(id);

		return found.orElseThrow(
			() -> new RuntimeException("Question_NOT_FOUND")
		);
	}
}