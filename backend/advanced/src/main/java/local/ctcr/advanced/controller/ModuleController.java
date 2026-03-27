package local.ctcr.advanced.controller;

import com.example.model.Module;
import com.example.service.ModuleService;
import com.example.service.UserProgressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/modules")
@RequiredArgsConstructor
public class ModuleController {

    private final ModuleService moduleService;
    private final UserProgressService userProgressService;

    // ── Public ────────────────────────────────────────────────────────────────

    @GetMapping
    public ResponseEntity<List<Module>> getAllModules() {
        return ResponseEntity.ok(moduleService.getAllModules());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Module> getModuleById(@PathVariable Long id) {
        return ResponseEntity.ok(moduleService.getModuleById(id));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<Module> getModuleBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(moduleService.getModuleBySlug(slug));
    }

    // ── Authenticated: check completion status ─────────────────────────────

    @GetMapping("/{id}/completed")
    public ResponseEntity<Boolean> isModuleCompleted(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = ((com.example.model.User) userDetails).getId();
        return ResponseEntity.ok(userProgressService.hasCompletedModule(userId, id));
    }

    // ── Admin only ────────────────────────────────────────────────────────────

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Module> createModule(@Valid @RequestBody Module module) {
        return ResponseEntity.ok(moduleService.createModule(module));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Module> updateModule(
            @PathVariable Long id,
            @Valid @RequestBody Module module) {
        return ResponseEntity.ok(moduleService.updateModule(id, module));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteModule(@PathVariable Long id) {
        moduleService.deleteModule(id);
        return ResponseEntity.noContent().build();
    }
}