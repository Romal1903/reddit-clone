package com.redditclone.backend.dto;

import lombok.Data;

@Data
public class PostRequest {
    private String title;
    private String content;
    private String imageUrl;
    private String communitySlug;
}
