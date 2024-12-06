package com.example.Main.domain.QnA.dto.response;

import com.example.Main.domain.Post.dto.PostDTO;
import com.example.Main.domain.QnA.dto.QnADTO;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class QnAResponse {
    private final QnADTO qnADTO;
}
