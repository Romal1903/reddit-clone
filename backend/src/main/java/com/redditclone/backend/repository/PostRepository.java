package com.redditclone.backend.repository;

import com.redditclone.backend.entity.Community;
import com.redditclone.backend.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByCommunityOrderByCreatedAtDesc(Community community);
    List<Post> findAllByOrderByCreatedAtDesc();

    @Query("SELECT p FROM Post p LEFT JOIN p.votes v " +
            "GROUP BY p " +
            "ORDER BY SUM(CASE WHEN v.type = 'UPVOTE' THEN 1 " +
            "WHEN v.type = 'DOWNVOTE' THEN -1 ELSE 0 END) DESC")
    List<Post> findAllOrderByVoteScore();

    @Query("SELECT p FROM Post p LEFT JOIN p.votes v " +
            "WHERE p.community = :community " +
            "GROUP BY p " +
            "ORDER BY SUM(CASE WHEN v.type = 'UPVOTE' THEN 1 " +
            "WHEN v.type = 'DOWNVOTE' THEN -1 ELSE 0 END) DESC")
    List<Post> findByCommunityOrderByVoteScore(@Param("community") Community community);

    @Query("SELECT p FROM Post p WHERE " +
            "LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(p.content) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Post> searchPosts(@Param("query") String query);
}
