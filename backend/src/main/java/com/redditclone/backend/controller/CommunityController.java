package com.redditclone.backend.controller;

import com.redditclone.backend.dto.CommunityRequest;
import com.redditclone.backend.dto.CommunityResponse;
import com.redditclone.backend.service.CommunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/communities")
@RequiredArgsConstructor
public class CommunityController {

    private final CommunityService communityService;

    @PostMapping
    public ResponseEntity<CommunityResponse> createCommunity(@RequestBody CommunityRequest request) {
        return ResponseEntity.ok(communityService.createCommunity(request));
    }

    @GetMapping
    public ResponseEntity<List<CommunityResponse>> getAllCommunities() {
        return ResponseEntity.ok(communityService.getAllCommunities());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<CommunityResponse> getCommunityBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(communityService.getCommunityBySlug(slug));
    }
}
