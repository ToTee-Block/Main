"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import apiClient, { fetchUserProfile } from "@/api/axiosConfig";
import styles from "@/styles/pages/post/detail.module.scss";
import classNames from "classnames";
import DivideBar from "@/components/divideBar";
import StackCTGY from "@/components/category/StackCTGY";
import LikeButton from "@/components/button/LikeButton";
import ReportButton from "@/components/button/ReportButton";
import ModifyButton from "@/components/button/ModifyButton";
import RemoveButton from "@/components/button/RemoveButton";
import CommentForm from "@/components/form/CommentForm";
import CommentCard from "@/components/card/CommentCard";
import ReportModal from "@/components/modal/ReportModal";
import MarkdownWithHtml from "@/components/MarkdownWithHtml";
import YesNoModal from "@/components/modal/YesNoModal";

interface Me {
  birthDate: string;
  createdDate: string;
  email: string;
  gender: string;
  id: number;
  modifiedDate: string;
  name: string;
  profileImg: string;
  role: string;
}

interface Comment {
  id: number;
  content: string;
  authorEmail: string;
  authorName: string;
  likes: Number;
  profileImg: string;
  createDate: string;
  replies: [];
}

interface Post {
  id: number;
  authorEmail: string;
  authorName: string;
  comments: any[];
  content: string;
  createdDate: string;
  isDraft: boolean;
  likedByEmails: string[];
  likes: number;
  modifiedDate: string;
  subject: string;
  techStacks: string[] | null;
}

const Detail: React.FC = () => {
  const [loginStatus, setLoginStatus] = useState(false);
  const [me, setMe] = useState<Me>();
  const [stacks, setStacks] = useState<string[]>();
  const [post, setPost] = useState<Post>();
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<Comment>();
  const [comment, setComment] = useState("");
  const [modalVisibleReport, setModalVisibleReport] = useState(false);
  const [modalVisibleDelete, setModalVisibleDelete] = useState(false);
  const [reportActiveNum, setReportActiveNum] = useState<Number>(0);
  const [reportTextInput, setReportTextInput] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const setValues = (post) => {
    setPost(post);
    setComments(post.comments);
    setLikes(post.likes);
  };

  const getMe = async () => {
    const response = await fetchUserProfile();
    console.log(response);
    if (response.resultCode == "200") {
      setMe(response.data);
      return true;
    }
    return false;
  };

  const postLike = async () => {
    if (!loginStatus) {
      alert("로그인이 필요합니다.");
      location.href = "/members";
      return;
    }
    try {
      const response = await apiClient.post(
        `http://localhost:8081/api/v1/posts/${post.id}/like`
      );

      const resultCode = response.data.resultCode;
      const msg = response.data.msg;
      const data = response.data.data;
      console.log(response.data);
      if (resultCode == "200") {
        setPost(data);
        setLikes(data.likes);
      } else {
        alert(msg);
      }
    } catch (error) {
      console.log(`error: ${error}`);
    }
  };

  const deletePost = async () => {
    if (!loginStatus) {
      alert("로그인이 필요합니다.");
      location.href = "/members";
      return;
    }
    try {
      const response = await apiClient.delete(
        `http://localhost:8081/api/v1/posts/${post.id}`
      );

      const resultCode = response.data.resultCode;
      if (resultCode == "200") {
        alert("게시물이 삭제되었습니다.");
        window.history.go(-1);
      } else {
        alert(response.data.msg);
      }
    } catch (error) {
      alert(`error: ${error}`);
    }
  };

  const postComment = async () => {
    if (!loginStatus) {
      alert("로그인이 필요합니다.");
      location.href = "/members";
      return;
    }
    const postId = post?.id;
    if (comment == "" || comment == null) {
      alert("댓글의 내용을 입력해주세요.");
      return;
    }
    try {
      const response = await apiClient.post(
        `http://localhost:8081/api/v1/posts/${post.id}/comments`,
        {
          content: comment,
          parentId: postId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resultCode = response.data.resultCode;
      const data = response.data.data;
      console.log(data.comment);
      if (resultCode == "201") {
        setComments((prevComments) => [data.comment, ...prevComments]);
        setComment("");
      } else if (resultCode == "404") {
        alert(response.data.msg);
      }
    } catch (error) {
      alert(`error: ${error}`);
    }
  };

  const postReport = async () => {
    if (!loginStatus) {
      alert("로그인이 필요합니다.");
      location.href = "/members";
      return;
    }

    console.log(reportActiveNum);

    try {
      const response = await apiClient.post(
        `http://localhost:8081/api/v1/reports/post/${post?.id}`,
        {
          reportCode: reportActiveNum,
          additionalNote: reportTextInput,
        }
      );

      const resultCode = response.data.resultCode;
      const data = response.data.data;
      console.log(response);
      if (resultCode == "201") {
        console.log(data);
      } else if (resultCode == "404") {
        alert(response.data.msg);
      }
    } catch (error) {
      alert(`error: ${error}`);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const id = Number(queryParams.get("id")) || 0; //기본값을 0로 설정

    const fetchRecentPosts = async () => {
      setLoginStatus(await getMe());
      try {
        const response = await axios.get(
          `http://localhost:8081/api/v1/posts/detail/${id}`
        );

        const resultCode = response.data.resultCode;
        const data = response.data.data;
        if (resultCode == "200") {
          setStacks(data.techStacks);
          setValues(data.post);
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
    };

    fetchRecentPosts(); // 페이지가 로드될 때 데이터 호출
  }, []); // 빈 배열을 넣어 컴포넌트가 마운트될 때 한 번만 호출

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.bodyContainer}>
      <div className={styles.container}>
        <div className={styles.postSection}>
          <div className={styles.titleBox}>
            <h1 className={styles.title}>{post?.subject}</h1>
            <DivideBar width={300}></DivideBar>
            <StackCTGY stacks={stacks} disabled={true}></StackCTGY>
          </div>
          <div className={styles.contentBox}>
            <div className={classNames(styles.content, styles.markdownContent)}>
              <MarkdownWithHtml markdownContent={post?.content} />
            </div>
          </div>
        </div>
        <div className={styles.utilBar}>
          <LikeButton likes={likes} postLike={postLike}></LikeButton>
          <ReportButton
            setModalVisible={() => setModalVisibleReport(true)}
          ></ReportButton>
          <div className={styles.airBox}></div>
          {post?.authorEmail !== me?.email ? (
            <></>
          ) : (
            <>
              <ModifyButton to={"#"}></ModifyButton>
              <RemoveButton
                setModalVisible={() => setModalVisibleDelete(true)}
              ></RemoveButton>
            </>
          )}
        </div>
        <div className={styles.commentSection}>
          <span>{post?.comments.length}개의 답변이 있습니다.</span>
          <CommentForm
            disabled={loginStatus}
            myProfileImg={me?.profileImg}
            comment={comment}
            setComment={setComment}
            postComment={postComment}
          ></CommentForm>
          <div className={styles.commentList}>
            {comments?.map((comment, index) => (
              <CommentCard
                key={comment.id}
                loginStatus={loginStatus}
                parentId={post.id}
                comment={comment}
                me={me}
              ></CommentCard>
            ))}
          </div>
        </div>
      </div>

      <ReportModal
        visible={modalVisibleReport}
        onConfirm={() => postReport()}
        onClose={() => setModalVisibleReport(false)}
        setReportActiveNum={(key: Number) => setReportActiveNum(key)}
        reportActiveNum={reportActiveNum}
        setReportTextInput={(text: string) => setReportTextInput(text)}
        reportTextInput={reportTextInput}
      />
      <YesNoModal
        visible={modalVisibleDelete}
        questionTxt="게시글을 삭제하시겠습니까?"
        onConfirm={deletePost}
        onClose={() => setModalVisibleDelete(false)}
      ></YesNoModal>
    </div>
  );
};

export default Detail;
