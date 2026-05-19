package com.redditclone.backend.controller;

import com.redditclone.backend.dto.VoteRequest;
import com.redditclone.backend.dto.VoteResponse;
import com.redditclone.backend.service.VoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/votes")
@RequiredArgsConstructor
public class VoteController {

    private final VoteService voteService;

    @PostMapping
    public ResponseEntity<VoteResponse> vote(@RequestBody VoteRequest request) {
        return ResponseEntity.ok(voteService.vote(request));
    }

    @GetMapping("/score/{postId}")
    public ResponseEntity<Integer> getVoteScore(@PathVariable Long postId) {
        return ResponseEntity.ok(voteService.getVoteScore(postId));
    }
}
