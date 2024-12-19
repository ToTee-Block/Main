package com.example.Main.domain.Chat.repository;

import com.example.Main.domain.Chat.entity.ChatJoin;
import com.example.Main.domain.Chat.entity.ChatRoom;
import com.example.Main.domain.Member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatJoinRepository extends JpaRepository<ChatJoin, Long> {
    List<ChatJoin> findByChatJoiner(Member chatJoiner);
    List<ChatJoin> findByChatRoom(ChatRoom chatRoom);
    long countByChatRoom(ChatRoom chatRoom);

    @Query("SELECT cj FROM ChatJoin cj WHERE cj.chatJoiner.id = :memberId AND cj.chatRoom.id = :roomId")
    Optional<ChatJoin> findByMemberIdAndRoomId(@Param("memberId") Long memberId, @Param("roomId") Long roomId);

    void deleteAllByChatJoiner(Member member);
}
