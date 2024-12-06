package com.example.Main.domain.QnA.dto.response;

import com.example.Main.domain.QnA.dto.QnADTO;
import com.example.Main.domain.QnA.entity.QnA;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class QnACreateResponse {
    private final QnADTO qnA;

    public QnACreateResponse(QnA qnA) {
        this.qnA = new QnADTO(qnA);
    }
}
