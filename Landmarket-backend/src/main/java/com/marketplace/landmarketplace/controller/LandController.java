package com.marketplace.landmarketplace.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.marketplace.landmarketplace.dto.LandResponse;
import com.marketplace.landmarketplace.model.Land;
import com.marketplace.landmarketplace.service.LandService;

@RestController
@RequestMapping("/api/lands")
public class LandController {

	private final LandService landService;

	public LandController(LandService landService) {
		this.landService = landService;
	}

	@PostMapping
	@PreAuthorize("hasRole('OWNER')")
	public ResponseEntity<LandResponse> createLand(@RequestBody Land land) {
		org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder
				.getContext().getAuthentication();
		System.out.println("Controller Entry | User: " + auth.getName() + " | Authorities: " + auth.getAuthorities());
		Land savedLand = landService.createLand(land);
		return ResponseEntity.ok(landService.mapToDTO(savedLand));
	}

	@GetMapping
	public ResponseEntity<List<LandResponse>> getAllLands() {
		List<LandResponse> list = landService.getAllLands()
				.stream()
				.map(landService::mapToDTO)
				.toList();
		return ResponseEntity.ok(list);
	}

	@GetMapping("/my-lands")
	@PreAuthorize("hasRole('OWNER')")
	public ResponseEntity<List<LandResponse>> getMyLands(org.springframework.security.core.Authentication auth) {
		String email = auth.getName();
		List<LandResponse> list = landService.getLandsByOwnerEmail(email)
				.stream()
				.map(landService::mapToDTO)
				.toList();
		return ResponseEntity.ok(list);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Land> getLandById(@PathVariable Long id) {
		Optional<Land> opt = landService.getLandById(id);
		return opt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
	}

	@PutMapping("/{id}")
	public ResponseEntity<Land> updateLand(@PathVariable Long id, @RequestBody Land landDetails) {
		Optional<Land> updated = landService.updateLand(id, landDetails);
		return updated.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteLand(@PathVariable Long id) {
		boolean deleted = landService.deleteLand(id);
		if (deleted)
			return ResponseEntity.noContent().build();
		return ResponseEntity.notFound().build();
	}

	@GetMapping("/approved")
	public ResponseEntity<List<Land>> getApprovedLands() {
		List<Land> list = landService.getApprovedLands();
		return ResponseEntity.ok(list);
	}

	@PutMapping("/{id}/approve")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Land> approveLand(@PathVariable Long id) {
		return landService.approveLand(id)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@PutMapping("/{id}/reject")
	public ResponseEntity<Land> rejectLand(@PathVariable Long id, @RequestParam String reason) {
		Optional<Land> opt = landService.rejectLand(id, reason);
		return opt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
	}

}
