package com.redditclone.backend.dto;

import com.redditclone.backend.entity.VoteType;
import lombok.Data;

@Data
public class VoteRequest {
    private Long postId;
    private VoteType voteType;
}
