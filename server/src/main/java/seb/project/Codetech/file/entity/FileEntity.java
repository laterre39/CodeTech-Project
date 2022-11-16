package seb.project.Codetech.file.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import seb.project.Codetech.global.auditing.BaseTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "FILE")
public class FileEntity extends BaseTime { // 파일은 업로드 이후 변경하지 않는다.
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String orgName; // 원본 파일 이름

	@Column(nullable = false, updatable = false)
	private String uuidName; // 변경해서 저장할 파일 이름

	@Column(nullable = false)
	private String path;
}
