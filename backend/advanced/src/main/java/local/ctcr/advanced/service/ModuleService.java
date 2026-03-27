package local.ctcr.advanced.service;

import com.example.model.Module;
import com.example.repository.ModuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ModuleService {

    private final ModuleRepository moduleRepository;

    public List<Module> getAllModules() {
        return moduleRepository.findAllByOrderByDisplayOrderAsc();
    }

    public Module getModuleById(Long id) {
        return moduleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Module not found: " + id));
    }

    public Module getModuleBySlug(String slug) {
        return moduleRepository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Module not found: " + slug));
    }

    @Transactional
    public Module createModule(Module module) {
        if (moduleRepository.findBySlug(module.getSlug()).isPresent()) {
            throw new IllegalArgumentException("Slug already in use: " + module.getSlug());
        }
        return moduleRepository.save(module);
    }

    @Transactional
    public Module updateModule(Long id, Module updated) {
        Module existing = getModuleById(id);
        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setDifficulty(updated.getDifficulty());
        existing.setDisplayOrder(updated.getDisplayOrder());
        existing.setImageUrl(updated.getImageUrl());
        return moduleRepository.save(existing);
    }

    @Transactional
    public void deleteModule(Long id) {
        moduleRepository.deleteById(id);
    }
}