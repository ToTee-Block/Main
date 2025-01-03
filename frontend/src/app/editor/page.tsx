"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import apiClient from "@/api/axiosConfig";
import { useRouter } from "next/navigation";
import styles from "@/styles/pages/editor/editor.module.scss";
import Tag from "@/components/tag/tag";
import EditorToolbar from "@/components/editortoolbar/editortoolbar";
import FileUpload from "@/components/editortoolbar/fileupload";
import ActionButtons from "@/components/button/EditorActionButtom/ActionButton";
import MarkdownWithHtml from "@/components/MarkdownWithHtml";

export default function EditorPage() {
  const [postingType, setPostingType] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [thumbNail, setThumbNail] = useState<string>();
  const [tags, setTags] = useState<string[]>();
  const [selectedTags, setSelectedTags] = useState<string[]>([""]);
  const [createPopup, setCreatePopup] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (files.length === 0) return;

    try {
      for (const file of files) {
        // 서버에 파일 업로드
        const formData = new FormData();
        formData.append("image", file);

        const response = await apiClient.patch(
          "http://localhost:8081/api/v1/posts/image",
          formData // FormData 객체를 전달
        );

        const resultCode = response.data.resultCode;
        const msg = response.data.msg;
        const data = response.data.data;
        if (resultCode === "200") {
          // 서버에서 반환된 이미지 URL
          const imageUrl = `/uploaded/${data}`;

          // 고유한 키 생성 (랜덤 문자열 사용)
          const imageKey = `image-${Math.random()
            .toString(36)
            .substring(2, 15)}`;

          const imageHtml = `\n<img src="${imageUrl}" alt="image" width="600" height="auto"/>`;

          const newContent = content + imageHtml;
          setContent(newContent);
        }
      }
    } catch (error) {
      console.error("이미지 처리 중 오류 발생:", error);
    }
  };

  const handleTagToggle = (tagName: string): void => {
    setSelectedTags((prev) => {
      let newState = [...prev];
      if (tagName === "전체") {
        return ["전체"];
      } else if (tagName === "임시저장") {
        return ["임시저장"];
      } else {
        if (
          newState.indexOf("전체") !== -1 ||
          newState.indexOf("임시저장") !== -1
        ) {
          newState = newState.filter(
            (item) => item !== "전체" && item !== "임시저장"
          );
        }
        if (newState.includes(tagName)) {
          newState = newState.filter((item) => item !== tagName);
          if (newState.length === 0) newState = ["전체"];
        } else {
          newState.push(tagName);
        }
        return newState;
      }
    });
  };

  useEffect(() => {
    if (createPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // 컴포넌트 언마운트 시에도 복원
    return () => {
      document.body.style.overflow = "";
    };
  }, [createPopup]);

  const goBack = () => {
    if (postingType == "posts") {
      router.push("/blog");
    } else {
      router.push("/qna/my");
    }
  };

  const postWrite = async (draft: boolean) => {
    let queryUrl = `http://localhost:8081/api/v1/${postingType}`;
    let response;
    let msg;
    try {
      if (sessionStorage.getItem("id") !== "") {
        console.log("수정하기");
        queryUrl = `${queryUrl}/${sessionStorage.getItem("id")}`;
        response = await apiClient.patch(
          queryUrl,
          {
            subject: title,
            content: content,
            techStacks: selectedTags,
            thumbnail: thumbNail,
            isDraft: draft,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        console.log("생성하기");
        response = await apiClient.post(
          queryUrl,
          {
            subject: title,
            content: content,
            techStacks: selectedTags,
            thumbnail: thumbNail,
            isDraft: draft,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
      const resultCode = response.data.resultCode;
      msg = response.data.msg;
      const data = response.data.data;
      console.log(response);
      if (resultCode === "200") {
        if (postingType === "posts") {
          router.push("/blog");
        } else {
          router.push("/qna/my");
        }
      } else if (resultCode === "400") {
        alert(msg);
      }
      setLoading(false);
    } catch (error) {
      alert(msg);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/v1/techStacks`
        );
        const resultCode = response.data.resultCode;
        const data = response.data.data;
        console.log(data);
        if (resultCode === "200") {
          setTags(data);
        }
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch recent posts.");
        setLoading(false);
      }

      const storedData = sessionStorage.getItem("postingType");
      const id = sessionStorage.getItem("id");
      if (storedData) {
        setPostingType(storedData);
      }
      if (id !== "") {
        try {
          const response = await axios.get(
            `http://localhost:8081/api/v1/posts/detail/${id}`
          );

          const resultCode = response.data.resultCode;
          const data = response.data.data;
          console.log(response);
          if (resultCode == "200") {
            setTitle(data.post.subject);
            setContent(data.post.content);
            setSelectedTags(data.post.techStacks);
            setThumbNail(data.post.thumbnail);
            console.log(data.post);
          } else if (resultCode == "400") {
            setError("올바른 게시물이 아닙니다.");
          } else if (resultCode == "500") {
            setError(response.data.msg);
          }
          setLoading(false);
        } catch (error) {
          setError("Failed to fetch recent posts.");
          setLoading(false);
        }
      }
    };

    fetchAll();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.editorContainer}>
      <div className={styles.editorSection}>
        <div className={styles.editorContent}>
          <input
            type="text"
            className={styles.titleInput}
            placeholder="제목을 작성해주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className={styles.divider} />

          <div className={styles.tagSection}>
            <Tag
              tags={tags}
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
            />
          </div>

          <EditorToolbar onContentChange={setContent} content={content} />

          <textarea
            className={styles.editorTextarea}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            placeholder="내용을 작성해주세요."
          />
        </div>

        <div className={styles.actionButtons}>
          <ActionButtons
            postingType={postingType}
            onClose={() => goBack()}
            onDraft={() => postWrite(true)}
            onWrite={() => setCreatePopup(true)}
          />
        </div>
      </div>

      {/* 미리보기 섹션 */}
      <div className={styles.previewSection}>
        <div className={styles.previewContent}>
          <input
            type="text"
            className={styles.previewTitle}
            value={title || ""}
            readOnly
          />

          <div className={styles.divider} />
          <div className={styles.markdownContent}>
            <MarkdownWithHtml markdownContent={content} />
            {/* <ReactMarkdown
              remarkPlugins={[
                [
                  remarkGfm,
                  { singleTilde: false, commonmark: true, footnotes: true },
                ],
              ]}
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className={styles.markdownH1} {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className={styles.markdownH2} {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className={styles.markdownH3} {...props} />
                ),
                h4: ({ node, ...props }) => (
                  <h4 className={styles.markdownH4} {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className={styles.markdownP} {...props} /> // 문단에 대한 스타일 추가
                ),
                a: ({ node, ...props }) => (
                  <a className={styles.markdownLink} {...props} />
                ),
                del: ({ node, ...props }) => (
                  <del className={styles.markdownStrike} {...props} />
                ),
                img: ({ node, src, ...props }) => {
                  const actualSrc = images[src] || src;
                  return actualSrc ? (
                    <img
                      className={styles.markdownImage}
                      src={actualSrc}
                      {...props}
                    />
                  ) : null;
                },
              }}
            >
              {content}
            </ReactMarkdown> */}
          </div>
        </div>
      </div>

      <div
        className={styles.createPopup}
        style={{ display: createPopup ? "block" : "none" }}
      >
        <div className={styles.innerBox}>
          <div className={styles.thumbNailSection}>
            <FileUpload
              id={Number(sessionStorage.getItem("id"))}
              thumbNail={thumbNail}
              setThumbNail={setThumbNail}
            />
          </div>
          <div className={styles.actionButtons}>
            <button
              className={styles.draftButton}
              onClick={() => setCreatePopup(false)}
            >
              취소
            </button>
            <button
              className={styles.submitButton}
              onClick={() => postWrite(false)}
            >
              작성완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
