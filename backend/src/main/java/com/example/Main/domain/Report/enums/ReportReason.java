package com.example.Main.domain.Report.enums;

import com.example.Main.domain.TechStack.enums.TechStacks;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public enum ReportReason {
    INAPPROPRIATE_CONTENT(1, "부적절한 내용"),
    OFFENSIVE_LANGUAGE_AND_HATE(2, "욕설 및 혐오감 조성"),
    HARMFUL_OR_DANGEROUS_CONTENT(3, "유해하거나 위험한 내용"),
    REPEATED_CONTENT_AND_ADVERTISEMENT(4, "반복적인 내용과 광고성 내용"),
    MALICIOUS_CONTENT(5, "의도적인 악성 내용");

    private final int code;
    private final String description;

    ReportReason(int code, String description) {
        this.code = code;
        this.description = description;
    }

    public static ReportReason fromCode(int code) {
        for (ReportReason reason : ReportReason.values()) {
            if (reason.code == code) {
                return reason;
            }
        }
        throw new IllegalArgumentException("Invalid code: " + code);
    }

    public static Map<Integer, String> toMap() {
        Map<Integer, String> allReasons = new HashMap<>();
        for (ReportReason reason : ReportReason.values()) {
            allReasons.put(reason.getCode(), reason.getDescription());
        }
        return allReasons;
    }

    public int getCode() {
        return code;
    }
    public String getDescription() {
        return description;
    }
}
