package com.redditclone.backend.controller;

import com.redditclone.backend.dto.PostRequest;
import com.redditclone.backend.dto.PostResponse;
import com.redditclone.backend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping("/api/posts")
    public ResponseEntity<PostResponse> createPost(@RequestBody PostRequest request) {
        return ResponseEntity.ok(postService.createPost(request));
    }

    @GetMapping("/api/posts")
    public ResponseEntity<List<PostResponse>> getAllPosts(
            @RequestParam(defaultValue = "new") String sort) {
        return ResponseEntity.ok(postService.getAllPosts(sort));
    }

    @GetMapping("/api/posts/{id}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @GetMapping("/api/communities/{slug}/posts")
    public ResponseEntity<List<PostResponse>> getPostsByCommunity(
            @PathVariable String slug,
            @RequestParam(defaultValue = "new") String sort) {
        return ResponseEntity.ok(postService.getPostsByCommunity(slug, sort));
    }
}
