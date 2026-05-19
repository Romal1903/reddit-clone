package com.redditclone.backend.repository;

import com.redditclone.backend.entity.Comment;
import com.redditclone.backend.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostAndParentCommentIsNullOrderByCreatedAtDesc(Post post);
    int countByPost(Post post);
}
