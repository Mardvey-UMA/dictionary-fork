package org.ru.dictionary.repository;

import org.ru.dictionary.entity.Course;
import org.ru.dictionary.entity.Level;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LevelRepository extends JpaRepository<Level, Long> {
    List<Level> findByCourseIdOrderByOrderNumberAsc(Long courseId);
    List<Level> findByCourseId(Long courseId);
    Optional<Level> findMaxOrderNumberByCourseId(Long courseId);
    List<Level> findByCourseIdOrderByOrderNumberDesc(Long courseId);

}
