package com.example.Main.domain.QnA.dto.response;

import com.example.Main.domain.QnA.dto.QnADTO;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;
@Getter
@AllArgsConstructor
public class QnAsResponse {
    private final List<QnADTO> qnADTOS;
}
