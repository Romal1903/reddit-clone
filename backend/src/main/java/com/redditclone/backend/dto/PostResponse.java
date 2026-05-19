package com.redditclone.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PostResponse {
    private Long id;
    private String title;
    private String content;
    private String imageUrl;
    private String authorUsername;
    private String communityName;
    private String communitySlug;
    private int commentCount;
    private int voteScore;
}
