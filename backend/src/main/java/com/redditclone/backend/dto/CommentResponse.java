package com.redditclone.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentResponse {
    private Long id;
    private String content;
    private String authorUsername;
    private Long postId;
    private Long parentCommentId;
    private LocalDateTime createdAt;
    private List<CommentResponse> replies;
}
