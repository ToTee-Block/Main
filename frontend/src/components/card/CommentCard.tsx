"use client";

import React, { useState, useEffect } from "react";
import apiClient from "@/api/axiosConfig";
import classNames from "classnames";
import styles from "@/styles/components/card/comment-card.module.scss";
import YesNoModal from "@/components/modal/YesNoModal";
import CommentForm from "../form/CommentForm";
import SubmitButton from "../button/SubmitButton";

interface CommentCardProps {
  loginStatus: boolean;
  parentId: Number;
  comment: string;
  me: [] | undefined;
}

const CommentCard: React.FC<CommentCardProps> = ({
  loginStatus,
  parentId,
  comment,
  me,
}) => {
  const [thisComment, setThisComment] = useState(comment);
  const [isVisible, setIsVisible] = useState(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false); // 삭제
  const [ismodifying, setIsModifying] = useState<boolean>(false);
  const [modifyComment, setModifyComment] = useState<string>("");
  const [visibleReply, setVisibleReply] = useState<boolean>(false);
  const [replyComments, setReplyComments] = useState(comment.replies);
  const [replyComment, setReplyComment] = useState<string>("");

  const postLike = async () => {
    if (!loginStatus) {
      alert("로그인이 필요합니다.");
      location.href = "/members";
      return;
    }

    let parentType = "posts";
    if (location.href.indexOf("post") == -1) {
      parentType = "qnas";
    }

    try {
      const response = await apiClient.post(
        `http://localhost:8081/api/v1/${parentType}/${parentId}/comments/${thisComment.id}/like`
      );

      const resultCode = response.data.resultCode;
      const msg = response.data.msg;
      const data = response.data.data;
      console.log(response.data);
      if (resultCode == "200") {
        setThisComment(data.comment);
      } else if (resultCode == "401") {
        alert(msg);
        location.href = "";
      } else if (resultCode == "500") {
        alert(`error: ${msg}`);
      }
    } catch (error) {
      alert(`error: ${error}`);
    }
  };

  const deleteComment = async () => {
    if (!loginStatus) {
      alert("로그인이 필요합니다.");
      location.href = "/members";
      return;
    }

    let parentType = "posts";
    if (location.href.indexOf("post") == -1) {
      parentType = "qnas";
    }

    try {
      const response = await apiClient.delete(
        `http://localhost:8081/api/v1/${parentType}/${parentId}/comments/${thisComment.id}`
      );
      const resultCode = response.data.resultCode;
      const msg = response.data.msg;

      console.log(response);

      if (resultCode === "200") {
        setIsVisible(false); // 컴포넌트를 숨김
      } else {
        alert(`error: ${msg}`);
      }
    } catch (error) {
      alert(`error: ${error}`);
    }
  };

  const postReplyComment = async () => {
    if (!loginStatus) {
      alert("로그인이 필요합니다.");
      location.href = "/members";
      return;
    }
    if (replyComment == "" || replyComment == null) {
      alert("댓글의 내용을 입력해주세요.");
      return;
    }

    let parentType = "posts";
    if (location.href.indexOf("post") == -1) {
      parentType = "qnas";
    }

    console.log(replyComment);
    try {
      const response = await apiClient.post(
        `http://localhost:8081/api/v1/${parentType}/${parentId}/comments/${thisComment.id}/replies`,
        {
          content: replyComment,
          parentId: thisComment.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resultCode = response.data.resultCode;
      const data = response.data;
      console.log(data);
      if (resultCode == "201") {
        setReplyComments((prevComments) => [data.data, ...prevComments]);
        setReplyComment("");
      } else if (resultCode == "404") {
        alert(response.data.msg);
      }
    } catch (error) {
      alert(`error: ${error}`);
    }
  };

  const patchComment = async () => {
    if (!loginStatus) {
      alert("로그인이 필요합니다.");
      location.href = "/members";
      return;
    }
    if (modifyComment == "" || modifyComment == null) {
      alert("댓글의 내용을 입력해주세요.");
      return;
    }

    let parentType = "posts";
    if (location.href.indexOf("post") == -1) {
      parentType = "qnas";
    }

    console.log(modifyComment);
    try {
      const response = await apiClient.patch(
        `http://localhost:8081/api/v1/${parentType}/${parentId}/comments/${thisComment.id}`,
        {
          content: modifyComment,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resultCode = response.data.resultCode;
      const data = response.data.data;
      console.log(response.data);
      if (resultCode == "200") {
        if (parentType == "posts") {
          setThisComment(data.comment);
        } else {
          setThisComment(data.commentDTO);
        }
        setIsModifying(false);
      } else if (resultCode == "404") {
        alert(response.data.msg);
      }
    } catch (error) {
      alert(`error: ${error}`);
    }
  };

  const setTimeGapOfComment = (comment) => {
    const createdDate = new Date(comment.createdDate);
    const currentTime = new Date();

    const timeGapInMillis = currentTime - createdDate;

    // 밀리초를 시간, 분, 초로 변환
    const seconds = Math.floor(timeGapInMillis / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    // 나머지 시간, 분, 초
    const remainingHours = hours % 24;
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;

    if (days > 0) {
      return `${days}일 전`;
    } else if (hours > 0) {
      return `${remainingHours}시간 전`;
    } else if (remainingMinutes > 0) {
      return `${remainingMinutes}분 전`;
    } else {
      return `${remainingSeconds}초 전`;
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <div className={styles.CommentCard}>
        <div className={styles.likeBox}>
          <button onClick={postLike}>
            <img src="/icon/thumbs_up.svg" alt="좋아요 아이콘" />
          </button>
          <div className={styles.like}>
            <span>{thisComment.likes}</span>
          </div>
        </div>
        <div className={styles.contentBox}>
          <div className={styles.profile}>
            <div className={classNames(styles.imgBox, styles.profileImg)}>
              <img
                src={
                  thisComment.profileImg !== ""
                    ? thisComment.profileImg
                    : "/images/Rectangle.png"
                }
                alt="사용자 프로필 이미지"
              />
            </div>
            <div className={styles.name}>
              <span>{thisComment.authorName}</span>
            </div>
            <div className={styles.timeGap}>
              <span>{setTimeGapOfComment(thisComment)}</span>
            </div>
          </div>
          <div className={styles.content}>
            {ismodifying ? (
              <div className={styles.modifyCommentForm}>
                <textarea
                  onChange={(e) => {
                    setModifyComment(e.target.value);
                  }}
                  defaultValue={modifyComment}
                ></textarea>
                <div className={styles.action}>
                  <button onClick={() => setIsModifying(false)}>취소</button>
                  <button onClick={patchComment}>수정</button>
                </div>
              </div>
            ) : (
              <pre>{thisComment.content}</pre>
            )}
          </div>
          <div className={styles.util}>
            <button onClick={() => setVisibleReply(!visibleReply)}>
              {visibleReply
                ? "[ - ] 숨기기"
                : comment.replies?.length == 0
                ? "[+] 댓글 쓰기"
                : `[+] ${comment.replies?.length}개의 댓글`}
            </button>
            {me === undefined ||
            thisComment?.authorEmail !== me.email ||
            ismodifying ? (
              <></>
            ) : (
              <div className={styles.rightBox}>
                <button onClick={() => setModalVisible(true)}>
                  <img src="/icon/trash_can.svg" alt="삭제 아이콘" />
                </button>
                <button
                  onClick={() => {
                    setIsModifying(!ismodifying);
                    setModifyComment(thisComment.content);
                  }}
                >
                  <img src="/icon/modify_pen.svg" alt="수정 아이콘" />
                </button>
              </div>
            )}
          </div>
          {visibleReply ? (
            <div className={styles.reply}>
              {replyComments?.map((reply) => (
                <CommentCard
                  key={reply.id}
                  loginStatus={loginStatus}
                  parentId={parentId}
                  comment={reply}
                  me={me}
                ></CommentCard>
              ))}
              <CommentForm
                disabled={loginStatus}
                myProfileImg={me?.profileImg}
                comment={replyComment}
                setComment={setReplyComment}
                postComment={postReplyComment}
              ></CommentForm>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      <YesNoModal
        visible={modalVisible}
        questionTxt="해당 댓글을 삭제하시겠습니까?"
        onConfirm={deleteComment}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};

export default CommentCard;
