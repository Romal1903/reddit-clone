package com.redditclone.backend.service;

import com.redditclone.backend.dto.CommunityRequest;
import com.redditclone.backend.dto.CommunityResponse;
import com.redditclone.backend.entity.Community;
import com.redditclone.backend.entity.User;
import com.redditclone.backend.repository.CommunityRepository;
import com.redditclone.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommunityService {

    private final CommunityRepository communityRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private CommunityResponse toResponse(Community community) {
        return new CommunityResponse(
                community.getId(),
                community.getName(),
                community.getSlug(),
                community.getDescription(),
                community.getPosts() == null ? 0 : community.getPosts().size()
        );
    }

    private String generateSlug(String name) {
        return name.toLowerCase()
                .trim()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-");
    }

    public CommunityResponse createCommunity(CommunityRequest request) {
        if (communityRepository.findByName(request.getName()).isPresent()) {
            throw new RuntimeException("Community name already exists");
        }

        String slug = generateSlug(request.getName());
        if (communityRepository.findBySlug(slug).isPresent()) {
            throw new RuntimeException("Community slug already exists");
        }

        Community community = Community.builder()
                .name(request.getName())
                .slug(slug)
                .description(request.getDescription())
                .createdBy(getCurrentUser())
                .build();

        return toResponse(communityRepository.save(community));
    }

    public List<CommunityResponse> getAllCommunities() {
        return communityRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public CommunityResponse getCommunityBySlug(String slug) {
        Community community = communityRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Community not found with slug: " + slug));
        return toResponse(community);
    }

    public List<CommunityResponse> searchCommunities(String query) {
        return communityRepository.searchCommunities(query)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}
