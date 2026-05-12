package com.lifeos.repository;

import com.lifeos.entity.Project;
import com.lifeos.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByUserOrderByCreatedAtDesc(User user);
    Optional<Project> findByIdAndUser(Long id, User user);
}
