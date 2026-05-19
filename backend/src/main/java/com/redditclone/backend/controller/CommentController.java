package com.redditclone.backend.controller;

import com.redditclone.backend.dto.CommentRequest;
import com.redditclone.backend.dto.CommentResponse;
import com.redditclone.backend.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/api/comments")
    public ResponseEntity<CommentResponse> addComment(@RequestBody CommentRequest request) {
        return ResponseEntity.ok(commentService.addComment(request));
    }

    @GetMapping("/api/posts/{id}/comments")
    public ResponseEntity<List<CommentResponse>> getCommentsByPost(@PathVariable Long id) {
        return ResponseEntity.ok(commentService.getCommentsByPost(id));
    }

    @GetMapping("/api/posts/{id}/comments/count")
    public ResponseEntity<Integer> getCommentCount(@PathVariable Long id) {
        return ResponseEntity.ok(commentService.getCommentCount(id));
    }
}
