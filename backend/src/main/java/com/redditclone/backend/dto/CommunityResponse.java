package com.redditclone.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CommunityResponse {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private int postCount;
}
