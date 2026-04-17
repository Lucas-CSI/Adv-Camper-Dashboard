package local.ctcr.advanced.repository;

import local.ctcr.advanced.model.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> {
    Optional<Module> findBySlug(String slug);
    List<Module> findAllByOrderByDisplayOrderAsc();
    List<Module> findByDifficulty(Module.Difficulty difficulty);
}