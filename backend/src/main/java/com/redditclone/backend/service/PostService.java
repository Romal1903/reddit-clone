package com.redditclone.backend.service;

import com.redditclone.backend.dto.PostRequest;
import com.redditclone.backend.dto.PostResponse;
import com.redditclone.backend.entity.*;
import com.redditclone.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final CommunityRepository communityRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private int calculateVoteScore(List<Vote> votes) {
        if (votes == null) return 0;
        int upvotes = (int) votes.stream().filter(v -> v.getType() == VoteType.UPVOTE).count();
        int downvotes = (int) votes.stream().filter(v -> v.getType() == VoteType.DOWNVOTE).count();
        return upvotes - downvotes;
    }

    private PostResponse toResponse(Post post) {
        return new PostResponse(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getImageUrl(),
                post.getAuthor().getUsername(),
                post.getCommunity().getName(),
                post.getCommunity().getSlug(),
                post.getComments() == null ? 0 : post.getComments().size(),
                calculateVoteScore(post.getVotes())
        );
    }

    public PostResponse createPost(PostRequest request) {
        Community community = communityRepository.findBySlug(request.getCommunitySlug())
                .orElseThrow(() -> new RuntimeException("Community not found: " + request.getCommunitySlug()));

        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .imageUrl(request.getImageUrl())
                .author(getCurrentUser())
                .community(community)
                .build();

        return toResponse(postRepository.save(post));
    }

    public PostResponse getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
        return toResponse(post);
    }

    public List<PostResponse> getAllPosts(String sort) {
        List<Post> posts = "top".equals(sort)
                ? postRepository.findAllOrderByVoteScore()
                : postRepository.findAllByOrderByCreatedAtDesc();
        return posts.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<PostResponse> getPostsByCommunity(String slug, String sort) {
        Community community = communityRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Community not found: " + slug));
        List<Post> posts = "top".equals(sort)
                ? postRepository.findByCommunityOrderByVoteScore(community)
                : postRepository.findByCommunityOrderByCreatedAtDesc(community);
        return posts.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<PostResponse> searchPosts(String query) {
        return postRepository.searchPosts(query)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}
