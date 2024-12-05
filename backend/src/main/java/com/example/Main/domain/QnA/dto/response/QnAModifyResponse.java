package com.example.Main.domain.QnA.dto.response;

import com.example.Main.domain.QnA.dto.QnADTO;
import com.example.Main.domain.QnA.entity.QnA;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class QnAModifyResponse {

    private final QnADTO qnADTO;

    private final Boolean isDraft;

    public QnAModifyResponse(QnA qnA) {
        this.qnADTO = new QnADTO(qnA);
        this.isDraft = qnA.getIsDraft();
    }
}
