package com.redditclone.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class SearchResponse {
    private List<PostResponse> posts;
    private List<CommunityResponse> communities;
}
