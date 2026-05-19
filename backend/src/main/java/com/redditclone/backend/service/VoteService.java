package com.redditclone.backend.service;

import com.redditclone.backend.dto.VoteRequest;
import com.redditclone.backend.dto.VoteResponse;
import com.redditclone.backend.entity.*;
import com.redditclone.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VoteService {

    private final VoteRepository voteRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private int calculateScore(Post post) {
        int upvotes = voteRepository.countByPostAndType(post, VoteType.UPVOTE);
        int downvotes = voteRepository.countByPostAndType(post, VoteType.DOWNVOTE);
        return upvotes - downvotes;
    }

    @Transactional
    public VoteResponse vote(VoteRequest request) {
        User currentUser = getCurrentUser();

        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + request.getPostId()));

        Optional<Vote> existingVote = voteRepository.findByPostAndUser(post, currentUser);

        if (existingVote.isPresent()) {
            Vote vote = existingVote.get();

            if (vote.getType() == request.getVoteType()) {
                voteRepository.delete(vote);
                return new VoteResponse("Vote removed", calculateScore(post));
            } else {
                vote.setType(request.getVoteType());
                voteRepository.save(vote);
                return new VoteResponse("Vote updated", calculateScore(post));
            }
        } else {
            Vote newVote = Vote.builder()
                    .type(request.getVoteType())
                    .user(currentUser)
                    .post(post)
                    .build();
            voteRepository.save(newVote);
            return new VoteResponse("Vote added", calculateScore(post));
        }
    }

    public int getVoteScore(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));
        return calculateScore(post);
    }
}
