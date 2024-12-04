package com.example.Main.domain.Post.service;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.repository.MemberRepository;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.Post.dto.PostDTO;
import com.example.Main.domain.Post.entity.Post;
import com.example.Main.domain.Post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final MemberRepository memberRepository;
    private final MemberService memberService;

    // 게시글 전체 조회
    public List<PostDTO> getList() {
        List<Post> postList = this.postRepository.findAllByIsDraftFalse(Sort.by(Sort.Order.desc("createdDate")));

        List<PostDTO> postDTOList = postList.stream()
                .map(post -> new PostDTO(post))
                .collect(Collectors.toList());
        return postDTOList;
    }

    // 게시글 단건 조회
    public Post getPost(Long id) {
        Optional<Post> optionalPost = this.postRepository.findById(id);

        return optionalPost.orElse(null);
    }

    // 본인이 작성한 게시글 조회
    public List<PostDTO> getPostsByAuthor(String authorEmail) {
        List<Post> postsByAuthor = postRepository.findByAuthor_EmailAndIsDraftFalse(authorEmail, Sort.by(Sort.Order.desc("createdDate")));

        return postsByAuthor.stream()
                .map(PostDTO::new)
                .collect(Collectors.toList());
    }

    // 작성
    public Post write(String subject, String content, String userEmail, boolean isDraft) {
        Member member = memberService.getMemberByEmail(userEmail);

        Post post = Post.builder()
                .subject(subject)
                .content(content)
                .author(member)
                .isDraft(isDraft)
                .build();
        this.postRepository.save(post);
        return post;
    }

    // 수정
    public Post update(Post post, String content, String subject, String userEmail, boolean isDraft) {
        Member member = memberService.getMemberByEmail(userEmail);
        post.setSubject(subject);
        post.setContent(content);
        post.setAuthor(member);
        post.setIsDraft(isDraft);
        this.postRepository.save(post);
        return post;
    }

    // 삭제
    public void delete(Post post) {
        this.postRepository.delete(post);
    }

    // 임시 저장된 게시물 목록 조회
    public List<PostDTO> getDrafts() {
        List<Post> draftPosts = postRepository.findByIsDraftTrue(Sort.by(Sort.Order.desc("createdDate")));
        return draftPosts.stream()
                .map(PostDTO::new)
                .collect(Collectors.toList());
    }

    // 임시 저장된 게시글 전체 조회
    public Post continueDraft(Long postId, String content, String subject, String userEmail, boolean isDraft) {
        Post post = this.getPost(postId);

        if (post == null || !post.getIsDraft()) {
            throw new IllegalArgumentException("임시 저장된 게시글이 존재하지 않거나, 삭제된 게시글입니다.");
        }

        Member member = memberService.getMemberByEmail(userEmail);
        post.setContent(content);
        post.setSubject(subject);
        post.setAuthor(member);
        post.setIsDraft(isDraft);
        this.postRepository.save(post);
        return post;
    }

    // 본인이 임시저장한 게시글 조회
    public List<PostDTO> getDraftsByAuthor(String authorEmail) {
        List<Post> draftPosts = postRepository.findByAuthor_EmailAndIsDraftTrue(authorEmail, Sort.by(Sort.Order.desc("createdDate")));

        return draftPosts.stream()
                .map(PostDTO::new)
                .collect(Collectors.toList());
    }



    // 임시 저장된 게시물 삭제
    public void deleteDraft(Long id) {
        Optional<Post> optionalPost = this.postRepository.findById(id);
        if (optionalPost.isPresent()) {
            Post post = optionalPost.get();
            if (post.getIsDraft()) {
                this.postRepository.delete(post);
            }
        }
    }
    //  좋아요 추가
    public void likePost(Long postId, String memberEmail) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("게시물을 찾을 수 없습니다."));
        Member member = memberRepository.findByEmail(memberEmail).orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

        // 좋아요 추가
        post.addLike(member);
        postRepository.save(post);
    }

    // 좋아요 취소
    public void unlikePost(Long postId, String memberEmail) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("게시물을 찾을 수 없습니다."));
        Member member = memberRepository.findByEmail(memberEmail).orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

        post.removeLike(member);
        postRepository.save(post);
    }

    // 검색기능
    public List<PostDTO> searchPosts(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            List<Post> postList = postRepository.findAllByIsDraftFalse(Sort.by(Sort.Order.desc("createdDate")));
            return postList.stream()
                    .map(PostDTO::new)
                    .collect(Collectors.toList());
        }
        List<Post> postList = postRepository.searchByKeyword(keyword, Sort.by(Sort.Order.desc("createdDate")));
        return postList.stream()
                .map(PostDTO::new)
                .collect(Collectors.toList());
    }
}
