package org.ru.dictionary.dto.level;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ru.dictionary.dto.word.WordResponseDTO;

import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LevelResponseDTO implements Serializable {
    private Long id;
    private String name;
    private Integer orderNumber;
    private Long courseId;
    private List<WordResponseDTO> words;
}