package com.redditclone.backend.controller;

import com.redditclone.backend.dto.SearchResponse;
import com.redditclone.backend.service.CommunityService;
import com.redditclone.backend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final PostService postService;
    private final CommunityService communityService;

    @GetMapping
    public ResponseEntity<SearchResponse> search(@RequestParam String query) {
        return ResponseEntity.ok(new SearchResponse(
                postService.searchPosts(query),
                communityService.searchCommunities(query)
        ));
    }
}
