package com.example.Main.domain.Post.service;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.Post.dto.PostDTO;
import com.example.Main.domain.Post.entity.Post;
import com.example.Main.domain.Post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final MemberService memberService;

    public List<PostDTO> getList() {
        List<Post> postList = this.postRepository.findAll();

        List<PostDTO> postDTOList = postList.stream()
                .map(post -> new PostDTO(post))
                .collect(Collectors.toList());
        return postDTOList;
    }

    public Post getPost(Long id) {
        Optional<Post> optionalPost = this.postRepository.findById(id);

        return optionalPost.orElse(null);
    }

    public Post write(String subject, String content, String userEmail) {
        Member member = memberService.getMemberByEmail(userEmail);
        Post post = Post.builder()
                .subject(subject)
                .content(content)
                .author(member)
                .build();
        this.postRepository.save(post);
        return post;
    }

    public Post update(Post post, String content, String subject, String userEmail) {
        Member member = memberService.getMemberByEmail(userEmail);
        post.setSubject(subject);
        post.setContent(content);
        post.setAuthor(member);
        this.postRepository.save(post);
        return post;
    }

    public void delete(Post post) {
        this.postRepository.delete(post);
    }
}