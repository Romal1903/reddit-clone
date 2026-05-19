package com.redditclone.backend.repository;

import com.redditclone.backend.entity.Post;
import com.redditclone.backend.entity.User;
import com.redditclone.backend.entity.Vote;
import com.redditclone.backend.entity.VoteType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    Optional<Vote> findByPostAndUser(Post post, User user);
    int countByPostAndType(Post post, VoteType type);
}
