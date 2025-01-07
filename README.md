## 🚀프로젝트 명 : ToTee-Block(토티블록)
- 웹 URL : localhost:8081
- DB PORT : 3306
- DB username : postgres
- 데이터베이스 이름 : toteeblock-db

## 📢 프로젝트 목표
- 개발자들 간 기술 블로그
- 멘토 멘티 매칭 시스템
- 실시간 채팅으로 인한 소통

## ⏱️개발 기간
- 전체 개발 기간 : 2024-11-08 ~ 2024-12-27
- 프로젝트 주제 선정 기간 : 2024-11-08 ~ 2024-11-15
- UI 구현 : 2024-11-15 ~ 2024-12-27
- 기능 구현 : 2024-11-15 ~ 2024-12-27

## ⚙ 개발 환경
- 운영체제 : Windows 11
- 통합개발환경(IDE) : IntelliJ
- JDK 버전 : JDK 17
- 데이터 베이스 : PostgreSQL
- 빌드 툴 : Gradle
- 관리 툴 : GitHub


## 🔌 Dependencies
- Spring Boot DevTools
- Spring Data JPA
- Spring Validation
- Spring Web MVC
- Spring Security
- Springdoc OpenAPI
- PostgreSQL
- JWT
- Lombok
- Spring Mail
- Spring Messaging
- Spring WebSocket

## 💻 기술 스택
- 백엔드
    - SpringBoot, Spring Security, Spring Data JPA, Spring Mail, JWT, WebSocket
- 프론트엔드
    - TXS, SCSS, React, Node.js, Next.js, markdown
- 데이터베이스
    - PostgreSQL
    - Docker, DBeaver

## 🛠 DB 테이블 설계
- chat_room (채팅방)
- member (회원)
- tech_stack (기술 스택)
- chat_join (채팅 참여)
- chat_message (채팅 메시지)
- mentor (멘토)
- mentor_mentee_matching (멘토-멘티 매칭)
- mentor_review (멘토 리뷰)
- mentor_tech_stack (멘토 기술 스택)
- notification (알림)
- post (게시물)
- post_comment (게시물 댓글)
- post_comment_likes (게시물 댓글 좋아요)
- post_likes (게시물 좋아요)
- qna (질문과 답변)
- qna_likes (질문과 답변 좋아요)
- qnacomment (질문과 답변 댓글)
- report (신고)
- report_post (게시물 신고)
- report_post_comment (게시물 댓글 신고)
- report_qna (질문과 답변 신고)
- report_qnacomment (질문과 답변 댓글 신고)
- qna_comment_likes (질문과 답변 댓글 좋아요)

<br>

| E-R 다이어그램 |
|-----------|
| ![img.png](ReadmeFile/img.png) |

<br>

## 👨‍👩‍👧‍👦 조원 소개

<div align="center">

|                                                     **박승수 (팀장)**                                                      |                                                      **황혜현 (부팀장)**                                                      |                                                            **김진아**                                                            |                                                          **유윤하**                                                          |
|:---------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------------------------------------:|
| [<img style="height:150px;" src="ReadmeFile/img_1.png" alt="ReadmeFile/img_1.png"/>  <br/> @anyeok](https://github.com/anyeok) | [<img style="height:150px;" src="ReadmeFile/img_2.png" alt="ReadmeFile/img_2.png"> <br/> @hyeon924](https://github.com/hyeon924) | [<img style="height:150px;" src="ReadmeFile/img_3.png" alt="ReadmeFile/img_3.png"> <br/> @jinainkorea](https://github.com/jinainkorea) | [<img style="height:150px;" src="ReadmeFile/img_4.png" alt="ReadmeFile/img_4.png"> <br/> @yoonha-yu](https://github.com/yoonha-yu) |

|                                                       **유지훈**                                                       |                                                  **이상수**                                                   |                                                              **이은철**                                                              |
|:-------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------------:|
|      [<img style="height:150px;" src="ReadmeFile/img_7.png" alt="ReadmeFile/img_7.png" > <br/> @psm817](https://github.com/psm817)       | [<img style="height:150px;" src="ReadmeFile/img_6.png" alt="ReadmeFile/img_6.png"> <br/> @jiyoung-0y0](https://github.com/jiyoung-0y0) | [<img style="height:150px;" src="ReadmeFile/img_5.png" alt="ReadmeFile/img_5.png"> <br/> @LEEEUNCHEOL96](https://github.com/LEEEUNCHEOL96) |

</div>

## 🧑‍🏫 역할 분담

### 🍋‍🟩 박승수 (팀장)
- **UI**
    - 페이지 : 로그인, 회원가입, 회원 정보 수정, 비밀번호 수정, 관리자 페이지, 알림
- **기능**
    1. 멘토
       - 멘토 정보 조회
    2. 알림
       - WebSocket을 활용한 실시간 알림 기능
- **연동(백, 프론트 연동)**
    1. 회원
       - 회원가입
       - 로그인
       - 로그아웃
       - 회원 정보 수정
       - 비밀번호 수정
    2. 관리자
       - 회원 관리
       - 멘토 승인 관리
       - 게시글 관리
       - 신고글 관리
    3. 메인페이지
       - 멘토 정보
       - 알림
    4. 멘토 멘티
       - 멘토 세부 디테일
       - 멘토 찾기
        
<br>

### 🍋‍🟩 황혜현 (부팀장)
- 프론트 기반 소스 정리
- font 모듈화
- color 모듈화
- 모든 파일 components 모듈화 기반 소스 정리

<br>

### 🍋‍🟩 김진아
- **UI**
    - 페이지 : 포스팅, QnA, 글 에디터
- **기능**
    1. 회원
        - 로그인
        - 로그아웃
        - 회원 정보 수정
        - 이메일 인증
    2. 관리자
        - 회원 관리
        - 멘토 승인 관리
    3. DB 연동
        - AWS RDS: postgreSql

- **연동(백, 프론트 연동)**
    1. 메인페이지
        - 포스팅 정보
    2. 포스팅 & QnA
        - 전체 열람
        - 상세페이지
        - 댓글 & 대댓글
        - **에디터**
    - 글 작성
        - 글 수정
        - 썸네일 이미지 등록

<br>

### 🍋‍🟩 유윤하
- **UI**  메인, 상세, 멘토, QnA, 에디터
- **기능**
  1. 공통
      - 페이지 전환 로딩 애니메이션 구현
      - 푸터 자동차 애니메이션 구현
      - global.scss 구현
  2. 메인페이지
      - 전체 UI 디자인 구현
      - 메인 섹션 레이아웃
      - 멘토 카드 컴포넌트 디자인
  3. 멘토
      - 상세페이지 디자인
      - 멘토 리스트 레이아웃
      - 멘토 정보 조회 페이지
  4. 소개페이지
     -전체 UI 디자인 구현
  5. QnA
      - 상세페이지 디자인
      - 질문 섹션 레이아웃
  6. 에디터
      - 마크다운 에디터 구현
      - 드래그 앤 드롭 이미지 업로드
      - 실시간 미리보기 기능
      - 에디터/프리뷰 분할 레이아웃
      - 마크다운 문법 스타일링

<br>

### 🍋‍🟩 유지훈
- **기능**
    1. 채팅
        -  WebSocket을 활용한 실시간 채팅
        - 이모지,이미지 전송
    2. 알림
        - 채팅 알림   

<br>

### 🍋‍🟩 이상수

- **UI**
    - 채팅 창, 채팅 위젯 버튼
- **기능**
    1. 멘토
        - 엔티티 생성
        - 멘토 신청
    2. 기술 스택
        - 엔티티 생성
    3. 채팅
        - 엔티티 수정
        - 채팅방 선택
        - 채팅 기록 불러오기

- **연동(백, 프론트 연동)**
    1. 채팅
        - 송신자, 수신자 메세지 구분
            - 채팅 방 별로 메세지 구분
            - 실시간 채팅
            - 채팅 기록
            - 채팅 방 리스트 표시 및 선택
    2. 모든페이지
        - 채팅 위젯 버튼 적용

<br>

### 🍋‍🟩 이은철
- **기능**
    1. 포스트, 질문게시판
        - CRUD
        - 임시저장
        - 좋아요
    2. 댓글
        - CRUD
        - 대댓글
    3. 신고
        - 등록
        - 신고 게시글 삭제
    4. 알림
        - 댓글, 신고 알림

<br>

## 📝 프로젝트 전체 구조

```
백엔드
│  MainApplication.java
│
├─domain
│  ├─Chat
│  │  ├─controller
│  │  │      ChatController.java
│  │  │
│  │  ├─dto
│  │  │      ChatDTO.java
│  │  │
│  │  ├─entity
│  │  │      ChatJoin.java
│  │  │      ChatMessage.java
│  │  │      ChatRoom.java
│  │  │
│  │  ├─repository
│  │  │      ChatJoinRepository.java
│  │  │      ChatMessageRepository.java
│  │  │      ChatRoomRepository.java
│  │  │
│  │  └─serivce
│  │          ChatService.java
│  │
│  ├─Email
│  │  ├─dto
│  │  │      EmailDTO.java
│  │  │
│  │  └─service
│  │          EmailService.java
│  │
│  ├─Member
│  │  ├─controller
│  │  │      ApiV1AdminMemberController.java
│  │  │      ApiV1MemberController.java
│  │  │
│  │  ├─dto
│  │  │      MemberDTO.java
│  │  │
│  │  ├─entity
│  │  │      Member.java
│  │  │
│  │  ├─enums
│  │  │      MemberGender.java
│  │  │      MemberRole.java
│  │  │
│  │  ├─repository
│  │  │      MemberRepository.java
│  │  │
│  │  ├─request
│  │  │      AuthcodeRequest.java
│  │  │      MemberCreate.java
│  │  │      MemberRequest.java
│  │  │      PasswordChangeRequest.java
│  │  │
│  │  └─service
│  │          MemberService.java
│  │
│  ├─Mentor
│  │  ├─controller
│  │  │      ApiV1AdminMentorController.java
│  │  │      ApiV1MentorController.java
│  │  │
│  │  ├─dto
│  │  │      MatchingDTO.java
│  │  │      MentorDTO.java
│  │  │
│  │  ├─entity
│  │  │      Mentor.java
│  │  │      MentorMenteeMatching.java
│  │  │      MentorReview.java
│  │  │
│  │  ├─repository
│  │  │      MentorMenteeMatchingRepository.java
│  │  │      MentorRepository.java
│  │  │      MentorReviewRepository.java
│  │  │
│  │  ├─request
│  │  │      ApproveMentoringRequest.java
│  │  │      ApproveMentorRequest.java
│  │  │      MentoringRequest.java
│  │  │      MentorRegistrationRequest.java
│  │  │
│  │  └─service
│  │          MentorMenteeMatchingService.java
│  │          MentorService.java
│  │
│  ├─notification
│  │  ├─controller
│  │  │      ApiV1NotificationController.java
│  │  │
│  │  ├─dto
│  │  │      NotificationDTO.java
│  │  │
│  │  ├─entity
│  │  │      Notification.java
│  │  │
│  │  ├─repository
│  │  │      NotificationRepository.java
│  │  │
│  │  └─service
│  │          NotificationService.java
│  │
│  ├─Post
│  │  ├─Comment
│  │  │  ├─controller
│  │  │  │      ApiV1AdminPostCommentController.java
│  │  │  │      ApiV1PostCommentController.java
│  │  │  │      ApiV1PostReplyController.java
│  │  │  │
│  │  │  ├─dto
│  │  │  │  │  PostCommentDTO.java
│  │  │  │  │
│  │  │  │  ├─request
│  │  │  │  │      PostCommentCreateRequest.java
│  │  │  │  │      PostCommentLikeDTO.java
│  │  │  │  │      PostCommentModifyRequest.java
│  │  │  │  │
│  │  │  │  └─response
│  │  │  │          PostCommentCreateResponse.java
│  │  │  │          PostCommentModifyResponse.java
│  │  │  │          PostCommentResponse.java
│  │  │  │          PostCommentsResponse.java
│  │  │  │
│  │  │  ├─entity
│  │  │  │      PostComment.java
│  │  │  │
│  │  │  ├─repository
│  │  │  │      PostCommentRepository.java
│  │  │  │
│  │  │  └─service
│  │  │          PostCommentService.java
│  │  │
│  │  ├─controller
│  │  │      ApiV1AdminPostController.java
│  │  │      ApiV1PostController.java
│  │  │
│  │  ├─dto
│  │  │  │  PostDTO.java
│  │  │  │
│  │  │  ├─request
│  │  │  │      PostCreateRequest.java
│  │  │  │      PostLikeDTO.java
│  │  │  │      PostModifyRequest.java
│  │  │  │
│  │  │  └─response
│  │  │          PostCreateResponse.java
│  │  │          PostModifyResponse.java
│  │  │          PostResponse.java
│  │  │          PostsResponse.java
│  │  │
│  │  ├─entity
│  │  │      Post.java
│  │  │
│  │  ├─repository
│  │  │      PostRepository.java
│  │  │
│  │  └─service
│  │          PostService.java
│  │
│  ├─QnA
│  │  ├─Comment
│  │  │  ├─controller
│  │  │  │      ApiV1AdminQnACommentController.java
│  │  │  │      ApiV1QnACommentController.java
│  │  │  │      ApiV1QnAReplyController.java
│  │  │  │
│  │  │  ├─dto
│  │  │  │  │  QnACommentDTO.java
│  │  │  │  │
│  │  │  │  ├─request
│  │  │  │  │      QnACommentCreateRequest.java
│  │  │  │  │      QnACommentLikeDTO.java
│  │  │  │  │      QnACommentModifyRequest.java
│  │  │  │  │
│  │  │  │  └─response
│  │  │  │          QnACommentCreateResponse.java
│  │  │  │          QnACommentModifyResponse.java
│  │  │  │          QnACommentResponse.java
│  │  │  │          QnACommentsResponse.java
│  │  │  │
│  │  │  ├─entity
│  │  │  │      QnAComment.java
│  │  │  │
│  │  │  ├─repository
│  │  │  │      QnACommentRepository.java
│  │  │  │
│  │  │  └─service
│  │  │          QnACommentService.java
│  │  │
│  │  ├─controller
│  │  │      ApiV1AdminQnAController.java
│  │  │      ApiV1QnAController.java
│  │  │
│  │  ├─dto
│  │  │  │  QnADTO.java
│  │  │  │
│  │  │  ├─request
│  │  │  │      QnACreateRequest.java
│  │  │  │      QnALikeDTO.java
│  │  │  │      QnAModifyRequest.java
│  │  │  │
│  │  │  └─response
│  │  │          QnACreateResponse.java
│  │  │          QnAModifyResponse.java
│  │  │          QnAResponse.java
│  │  │          QnAsResponse.java
│  │  │
│  │  ├─entity
│  │  │      QnA.java
│  │  │
│  │  ├─repository
│  │  │      QnARepository.java
│  │  │
│  │  └─service
│  │          QnAService.java
│  │
│  ├─Report
│  │  ├─controller
│  │  │      ApiV1ReportAdminController.java
│  │  │      ApiV1ReportController.java
│  │  │
│  │  ├─dto
│  │  │  │  ReportDTO.java
│  │  │  │
│  │  │  ├─request
│  │  │  │      ReportRequest.java
│  │  │  │
│  │  │  └─summary
│  │  │          SummaryDTO.java
│  │  │
│  │  ├─entity
│  │  │      Report.java
│  │  │
│  │  ├─enums
│  │  │      ReportReason.java
│  │  │      ReportStatus.java
│  │  │
│  │  ├─repository
│  │  │      ReportRepository.java
│  │  │
│  │  └─service
│  │          ReportService.java
│  │
│  └─TechStack
│      ├─controller
│      │      ApiV1TechStackController.java
│      │
│      ├─dto
│      │      TechStackDTO.java
│      │
│      └─enums
│              TechStacks.java
│
└─global
    │  GlobalExceptionHandler.java
    │
    ├─Config
    │      WebMvcConfig.java
    │      WebSocketConfig.java
    │
    ├─ErrorMessages
    │      ErrorMessages.java
    │
    ├─InitData
    │      Init.java
    │
    ├─Jpa
    │      BaseEntity.java
    │
    ├─Jwt
    │      JwtProvider.java
    │
    ├─RsData
    │      RsData.java
    │
    ├─Security
    │      ApiSecurityConfig.java
    │      ChattingConfig.java
    │      JwtAuthorizationFilter.java
    │      SecurityConfig.java
    │      SecurityMember.java
    │      Webconfig.java
    │
    ├─TEST
    │      EmptyMultipartFile.java
    │
    └─Util
        │  Util.java
        │
        └─Service
                ImageService.java

프론트엔드
public
│  file.svg
│  globe.svg
│  next.svg
│  vercel.svg
│  window.svg
│
├─fonts
│      NotoSans-Bold.ttf
│      NotoSans-Medium.ttf
│      NotoSans-Regular.ttf
│
├─icon
│      arrow.svg
│      at_sign.svg
│      basicimage.svg
│      basicimage01.svg
│      bold.svg
│      card01.svg
│      card02.svg
│      card03.svg
│      chevrons_left.svg
│      chevrons_right.svg
│      chevron_left.svg
│      chevron_right.svg
│      circle_user.svg
│      close_eye.svg
│      ellipsis.svg
│      face_smile.svg
│      H1.svg
│      H2.svg
│      H3.svg
│      H4.svg
│      heart.svg
│      link.svg
│      loader.svg
│      location_arrow.svg
│      manager_calendrier.svg
│      manager_search.svg
│      manager_searchbox.svg
│      mdi_bell.svg
│      mdi_eye.svg
│      modify_pen.svg
│      more.svg
│      open_eye.svg
│      question.svg
│      sad.svg
│      search.svg
│      smile.svg
│      Star1.svg
│      syntax.svg
│      textline.svg
│      thumbs_up.svg
│      trash.svg
│      trash_can.svg
│      upload.svg
│      user.svg
│      x-close.svg
│      yellow_botton.svg
│
└─images
        background-img.png
        Background.png
        card.jpg
        card01.png
        card02.png
        card03.png
        image2.jpg
        image3.jpg
        image4.jpg
        image44.jpg
        image5.jpg
        image6.jpg
        image7.jpg
        image8.jpg
        image9.jpg
        logo.svg
        macmockup.png
        mentormentee.png
        pixel-car.png
        Rectangle.png
        
src
├─api
│      axiosConfig.ts
│
├─app
│  │  layout.tsx
│  │  page.tsx
│  │
│  ├─about
│  │      page.tsx
│  │
│  ├─blog
│  │      page.tsx
│  │
│  ├─chatting
│  │      page.tsx
│  │
│  ├─editor
│  │      page.tsx
│  │
│  ├─manager
│  │      page.tsx
│  │
│  ├─members
│  │  │  page.tsx
│  │  │
│  │  ├─join
│  │  │      page.tsx
│  │  │
│  │  ├─me
│  │  │      page.tsx
│  │  │
│  │  └─password
│  │          page.tsx
│  │
│  ├─mentor
│  │  │  page.tsx
│  │  │
│  │  ├─detail
│  │  │  └─[id]
│  │  │          page.tsx
│  │  │
│  │  ├─form
│  │  │      page.tsx
│  │  │
│  │  └─mymentor
│  │          page.tsx
│  │
│  ├─post
│  │  │  page.tsx
│  │  │
│  │  └─detail
│  │          page.tsx
│  │
│  └─qna
│      │  page.tsx
│      │
│      ├─detail
│      │      page.tsx
│      │
│      └─my
│              page.tsx
│
├─components
│  │  divideBar.tsx
│  │  Footer.tsx
│  │  Header.tsx
│  │  MarkdownWithHtml.tsx
│  │  Tabs.tsx
│  │
│  ├─animation
│  │      loading.tsx
│  │
│  ├─birthday
│  │      Birthday.tsx
│  │
│  ├─button
│  │  │  ApplyButton.tsx
│  │  │  CheckButton.tsx
│  │  │  EditButton.tsx
│  │  │  GenderButton.tsx
│  │  │  LikeButton.tsx
│  │  │  LinkButton.tsx
│  │  │  Loginbutton.tsx
│  │  │  MentorApplyButton.tsx
│  │  │  MentorButton.tsx
│  │  │  ModifyButton.tsx
│  │  │  MoreButton.tsx
│  │  │  RemoveButton.tsx
│  │  │  ReportButton.tsx
│  │  │  SubmitButton.tsx
│  │  │  TextLinkButton.tsx
│  │  │
│  │  └─EditorActionButtom
│  │          ActionButton.tsx
│  │
│  ├─card
│  │      CommentCard.tsx
│  │      LinkCard.tsx
│  │      MentorCard.tsx
│  │      PostCard.tsx
│  │
│  ├─chatting
│  │      ChatButton.tsx
│  │      ChatContainer.tsx
│  │      ChatFooter.tsx
│  │      ChatHeader.tsx
│  │      ChatList.tsx
│  │      ChatMessages.tsx
│  │      ChatSection.tsx
│  │
│  ├─editortoolbar
│  │      editortoolbar.tsx
│  │      fileupload.tsx
│  │
│  ├─exception
│  │      NoSearch.tsx
│  │
│  ├─form
│  │      CommentForm.tsx
│  │
│  ├─input
│  │      TextInput.tsx
│  │
│  ├─loadingprovier
│  │      loadingprovider.tsx
│  │
│  ├─manager
│  │      Pagination.tsx
│  │      SerchFilter.tsx
│  │      Sidebar.tsx
│  │      Table.tsx
│  │
│  ├─mentoring
│  │      Mentoring.tsx
│  │
│  ├─modal
│  │      ReportModal.tsx
│  │      YesNoModal.tsx
│  │
│  ├─pagewrapper
│  │      pagewrapper.tsx
│  │
│  ├─pagination
│  │      custompagination.tsx
│  │
│  ├─profile
│  │      ProfileImage.tsx
│  │
│  ├─search
│  │      SearchBox.tsx
│  │
│  └─tag
│          tag.tsx
│
└─types
        sockjs-client.d.ts
        
styles
├─components
│  │  divide-bar.module.scss
│  │  footer.module.scss
│  │  header.module.scss
│  │  tabs.module.scss
│  │
│  ├─animation
│  │      car.module.scss
│  │      loading.module.scss
│  │
│  ├─birthday
│  │      birthday.module.scss
│  │
│  ├─button
│  │  │  apply-button.module.scss
│  │  │  check-button.module.scss
│  │  │  edit-botton.module.scss
│  │  │  gender-button.module.scss
│  │  │  like-button.module.scss
│  │  │  link-button.module.scss
│  │  │  login-button.module.scss
│  │  │  mentor-apply-button.module.scss
│  │  │  mentor-button.module.scss
│  │  │  modify-button.module.scss
│  │  │  more-button.module.scss
│  │  │  remove-button.module.scss
│  │  │  report-button.module.scss
│  │  │  submit-button.module.scss
│  │  │  text-link-button.module.scss
│  │  │
│  │  └─editor
│  │          editoraction-button.module.scss
│  │
│  ├─card
│  │      comment-card.module.scss
│  │      link-card.module.scss
│  │      mentor-card.module.scss
│  │      post-card.module.scss
│  │
│  ├─chatting
│  │      ChatButton.module.scss
│  │      ChatContainer.module.scss
│  │      ChatFooter.module.scss
│  │      ChatHeader.module.scss
│  │      ChatList.module.scss
│  │      ChatMessages.module.scss
│  │
│  ├─editortoolbar
│  │      editortoolbar.module.scss
│  │      fileupload.module.scss
│  │
│  ├─exception
│  │      no-search.module.scss
│  │
│  ├─form
│  │      comment-form.module.scss
│  │
│  ├─input
│  │      text-input.module.scss
│  │
│  ├─manager
│  │      pagination.module.scss
│  │      serchFilter.module.scss
│  │      sidebar.module.scss
│  │      table.module.scss
│  │
│  ├─mentoring
│  │      mentoring.module.scss
│  │
│  ├─modal
│  │      report-modal.module.scss
│  │      yesno-modal.module.scss
│  │
│  ├─pagination
│  │      pagination.module.scss
│  │
│  ├─profile
│  │      profile.module.scss
│  │
│  ├─search
│  │      searchBox.module.scss
│  │
│  └─tag
│          tag.module.scss
│
├─globals
│      color.scss
│      font-mixin.scss
│      font.scss
│      global.scss
│
└─pages
    │  about.module.scss
    │  home.module.scss
    │  home.scss
    │
    ├─blog
    │      blog.module.scss
    │
    ├─chatting
    │      chatting.module.scss
    │
    ├─editor
    │      editor.module.scss
    │
    ├─manager
    │      manager.module.scss
    │
    ├─members
    │      form.module.scss
    │      join.module.scss
    │      login.module.scss
    │      password.module.scss
    │
    ├─mentor
    │      mentor-detail.module.scss
    │      mentor-form.module.scss
    │      mentor.module.scss
    │      mymentor.module.scss
    │
    ├─post
    │      detail.module.scss
    │      list.module.scss
    │
    └─qna
            detail.module.scss
            myqna.module.scss
            qna.module.scss
```

## 🧜‍♀️ 작업 관리 방법

- GitHub Projects와 Issues를 사용하여 진행 상황을 공유했습니다.
- 매일 본인의 작업 양을 소화하고 각자 구현한 기능을 서로 테스트하며 프로그램의 신뢰성을 높였습니다.
- main으로 직접 올리기 보단 dev에서 기능들을 테스트 해보고 main으로 최종적으로 코드를 올려 프로그램의 신뢰성을 높였습니다.

## ⭐ 페이지별 기능 소개

### [메인화면]
- 홈페이지 접속 시 초기화면으로 화면의 기본 구조는 상단 메뉴바, 중간 본문, 하단 footer로 구분되어 있습니다.
    - 상단 메뉴바는 애니버스, 봉사활동, 입양정보, 후원하기, 애니마켓, 애니공지로 총 6개의 메뉴로 구성되어 있습니다.
    - 상단 메뉴바의 최상단 부분은 로그인, 회원가입도 함께 포함되어 있습니다.
    - 중간 본문에는 광고 및 홍보 배너와 봉사활동, 입양공고, 마켓 Best 상품을 요약한 리스트가 나열되어 있습니다.
    - 추가로 공지사항, 봉사 및 입양 후기, 각 메뉴의 바로가기 버튼이 중간 본문에 포함되어 있습니다.
    - 각 요약된 정보 옆에는 전체보기를 통해 해당 메뉴 페이지로 이동이 가능합니다.
    - 하단 footer는 이용약관과 개인정보처리방침을 비롯한 애니버스의 기본 정보를 나타냅니다.
- 로그인과 미로그인 시 화면에 나타나는 메뉴가 상이합니다.
    - 로그인이 되어 있지 않은 경우 : 로그인, 회원가입
    - 로그인이 되어 있는 경우 : 마이페이지, 장바구니, 로그아웃

| 메인화면                                                         |
|--------------------------------------------------------------|
| <img src="src/main/resources/static/images/capture/메인1.png"> |

<br>

### [회원가입]
- 회원가입 버튼과 동시에 이용약관 및 개인정보 수집에 대한 동의서 제출이 요구됩니다.
- 약관 동의 후 일반 회원가입을 진행할 수 있습니다.
- 회원가입의 모든 항목에 대한 유효성 검사를 적용하여 입력하지 않으면 회원가입이 진행되지 않습니다.
- ID는 중복확인을 필수로, 비밀번호는 비밀번호 확인절차를 거칩니다.
- 회원의 권한은 크게 두 가지로, 회원가입 시 보호소/기업 또는 일반회원을 선택할 수 있습니다.
- 보호소/기업을 선택하여 회원가입을 진행할 시, 서비스를 바로 이용할 수 없으며 최고 관리자의 승인이 필요합니다.
- 회원가입이 완료되면 로그인 화면으로 이동과 동시에 회원가입 시 입력한 이메일 주소로 환영 메일이 전송됩니다.
- 최고 관리자의 승인을 받은 보호소/기업 권한의 회원 역시 승인과 동시에 입력한 이메일 주소로 승인완료 메일이 전송됩니다.

| 회원가입                                                          |
|---------------------------------------------------------------|
| <img src="src/main/resources/static/images/capture/약관동의.png"> |
| <img src="src/main/resources/static/images/capture/회원가입.png"> |

<br>

### [로그인]
- 회원가입을 통해 생성된 ID와 PW로 로그인을 수행합니다.
- 카카오, 네이버, 구글을 통한 소셜 로그인은 버튼을 눌러 각 플랫폼에 로그인하면 자동으로 계정 생성과 동시에 로그인을 수행합니다.
- 로그인에 성공하면 메인화면으로 이동합니다.

| 로그인                                                          |
|--------------------------------------------------------------|
| <img src="src/main/resources/static/images/capture/로그인.png"> |

<br>

### [아이디 찾기, 임시비밀번호 발급]
- 아이디 찾기 버튼을 통해 회원가입 시 입력한 이메일 주소를 입력하고 찾기 버튼을 누르면 해당 회원의 아이디를 보여줍니다.
- 임시비밀번호 발급 버튼을 통해 회원가입 시 입력한 아이디와 이메일 주소를 입력하면 해당 이메일 주소로 임시비밀번호가 전송됩니다.
- 임시비밀번호를 발급받은 회원은 기존의 비밀번호가 아닌 발급받은 임시비밀번호를 통해서만 로그인이 가능합니다.

| 아이디 찾기, 임시비밀번호 발급                                               |
|-----------------------------------------------------------------|
| <img src="src/main/resources/static/images/capture/아이디찾기.png">  |
| <img src="src/main/resources/static/images/capture/임시비밀번호.png"> |

<br>

### [마이페이지]
- 로그인이 되어있는 사용자만 마이페이지에 진입할 수 있습니다.
- 마이페이지 내 메뉴는 마이프로필(회원목록), 봉사내역, 입양내역, 후원 및 마켓내역으로 총 4가지로 분류되어 있습니다.
- 각 회원의 권한마다 메뉴별로 보여지는 화면이 상이합니다.
    - 최고 관리자 (admin)
        - 회원목록 : 승인 여부와 관계없이 애니버스 서비스에 회원가입된 모든 회원의 리스트를 보여줍니다. 최고 관리자는 회원목록 메뉴를 통해 보호소/기업 권한을 가진 회원의 승인을 허락할 수 있습니다.
        - 봉사내역 : 봉사활동에 등록된 모든 봉사활동의 내역을 보여줍니다.
        - 입양내역 : 입양하기에 등록된 모든 유기동물의 내역을 보여줍니다.
        - 후원 및 마켓내역 : 모든 후원자의 후원 내역과 애니마켓에 등록된 모든 상품의 리스트를 보여줍니다.
    - 보호소/기업 회원 (company)
        - 마이프로필 : 회원의 가입 정보와 마켓에서 결제할 수 있는 애니포인트 충전이 가능하며, 프로필 수정과 탈퇴가 가능합니다. 보호소/기업 회원의 경우 일반회원이 해당 기업의 상품을 결제했다면, 결제금액이 자동으로 기업 애니포인트에 충전됩니다.
        - 봉사내역 : 보호소/기업 회원이 봉사활동에 등록한 봉사활동의 내역을 보여줍니다.
        - 입양내역 : 보호소/기업 회원이 입양하기에 등록한 유기동물의 내역을 보여줍니다.
        - 후원 및 마켓내역 : 보호소/기업 회원이 후원한 후원 내역과 애니마켓에 등록한 상품의 리스트를 보여줍니다.
    - 일반회원 및 소셜로그인 회원 (user)
        - 마이프로필 : 회원의 가입 정보와 마켓에서 결제할 수 있는 애니포인트 충전이 가능하며, 프로필 수정과 탈퇴가 가능합니다. 소셜로그인을 통한 회원의 경우, 프로필 수정 시 비밀번호는 변경이 불가합니다.
        - 봉사내역 : 일반회원이 봉사활동에 등록한 봉사활동의 내역을 보여줍니다.
        - 입양내역 : 일반회원이 입양하기에 등록한 유기동물의 내역을 보여줍니다.
        - 후원 및 마켓내역 : 회원이 후원한 후원 내역과 애니마켓에서 구매한 구매내역을 보여줍니다.

| 마이페이지                                                              |
|--------------------------------------------------------------------|
| <img src="src/main/resources/static/images/capture/마이페이지-관리자.png"> |
| <img src="src/main/resources/static/images/capture/마이페이지-기업.png">  |
| <img src="src/main/resources/static/images/capture/마이페이지-일반.png">  |

<br>

### [로그아웃]
- 상단 헤더의 로그아웃 버튼을 클릭하면 로그아웃과 동시에 메인페이지로 이동합니다.

<br>

### [애니버스]
- 애니버스는 기업 소개 페이지로 애니버스의 어원과 개발자 소개 및 위 사이트의 목표와 개요를 설명합니다.

| 애니버스                                                          |
|---------------------------------------------------------------|
| <img src="src/main/resources/static/images/capture/애니버스.png"> |

<br>

### [봉사활동]
- 봉사활동은 봉사활동과 봉사후기 두 가지의 소메뉴로 구분됩니다.
    - 봉사활동
        - 봉사활동은 사이트에 등록된 모든 봉사활동의 리스트를 보여주고, 캘린더를 통해 월간, 일간의 봉사활동을 한 눈에 확인할 수 있습니다.
        - 각 봉사활동의 사진이나 캘린더에서 일정을 클릭하면 해당 봉사활동의 상세보기 화면으로 이동이 가능합니다.
        - 상세보기 화면을 통해 일반 회원은 봉사활동 신청이 가능합니다.
        - 봉사활동은 로그인이 되어있을 때만 신청이 가능하며, 신청 시 신청 마감날짜가 지났거나 모집인원이 모두 채워졌을 경우 신청이 불가능합니다.
        - 봉사활동 등록 시 장소 선택은 카카오맵 OpenAPI를 사용하였습니다.
        - 봉사활동을 등록한 보호소/기업 회원 또는 최고 관리자는 신청인원보기를 통해 신청한 인원의 간단한 개인정보를 열람할 수 있습니다.
        - 봉사활동 등록과 수정, 삭제는 활동 글을 게시한 보호소/기업 회원 또는 최고 관리자에게만 권한이 있습니다.
    - 봉사후기
        - 봉사후기는 사이트에 등록된 모든 봉사후기의 리스트를 보여줍니다.
        - 봉사후기의 리스트를 클릭하면 해당 봉사후기의 상세보기 화면으로 이동이 가능합니다.
        - 상세보기 화면 내에서 버튼을 통해 이전, 다음글로 이동이 가능합니다.
        - 봉사후기 등록과 수정, 삭제는 후기 글을 게시한 회원에게만 권한이 있습니다.
        - 봉사후기 등록 시 대표 이미지를 제외하고 내용에 들어갈 첨부 이미지를 최대 3장까지 선택할 수 있습니다.

| 봉사활동                                                          |
|---------------------------------------------------------------|
| <img src="src/main/resources/static/images/capture/봉사활동.png"> |
| <img src="src/main/resources/static/images/capture/봉사후기.png"> |

<br>

### [입양정보]
- 입양정보는 입양절차, 입양정보, 입양후기, 입양공고 작성 4가지 소메뉴로 구성됩니다.
    - 입양절차
        - 입양절차는 입양정보 페이지 하단에 같이 위치해 있으며 입양절차 소메뉴를 클릭시
        - 페이지 하단으로 이동하여 입양절차에 대한 정보를 확인 할 수있습니다.
    - 입양정보
        - 입양절차는 사이트에 등록된 모든 유기동물의 리스트를 보여주고 카테고리 기능을 통해 조건에 맞는 유기동물을 검색 할 수있습니다.
        - 입양리스트에서 유기동물을 클릭 후 상세페이지로 이동하면 입양신청을 할 수 있습니다.
        - 입양신청페이지에서는 입양신청서 폼을 다운받아 작성해야하며 입양신청 유저에 대한 정보, 입양에 필요한 동의사항에 동의해야 합니다.
        - 입양신청에 대한 권한은 모든회원에게 있습니다.
    - 입양후기
        - 입양후기에서는 입양후기 리스트, 상세페이지, 입양후기 작성페이지가 구성되어 있습니다.
        - 입양후기 리스트에서는 모든 입양후기에 대한 정보가 나타납니다.
        - 상세페이지에서는 수정, 삭제 기능이 구현되어있습니다. 단 권한은 글을 작성한 회원에게만 있습니다.
        - 입양후기 작성페이지에서는 toast ui를 활용하여 게시글 작성페이지를 구현하였습니다.
        - 입양후기 작성권한은 입양을 한 회원에게만 있습니다.
    - 입양공고 작성
        - 입양공고 작성페이지는 입양동물을 등록할 수 있는 페이지로 등록에 필요한 정보들을 작성해야 합니다.
        - 입양공고 작성의 권한은 기업/동물센터 회원에게만 권한이 있습니다.

| 입양정보                                                          |
|---------------------------------------------------------------|
| <img src="src/main/resources/static/images/capture/입양.png">   |
| <img src="src/main/resources/static/images/capture/입양후기.png"> |

<br>

### [후원하기]
- 애니버스의 후원은 로그인한 사용자에 한해서만 후원이 가능합니다.
- 후원하기 클릭하면 후원 모달창 나옵니다.
- 후원은 애니버스에 가입한 보호센터 목록에서 지정하여 후원 할 수 있습니다.
- 금액을 직접 입력하여 후원 할 수 있습니다.
- 후원을 하면 상위 3명의 리스트가 가장 많이 후원한 사람의 등 수로 업데이트 됩니다.

| 후원하기                                                        |
|-------------------------------------------------------------|
| <img src="src/main/resources/static/images/capture/후원.png"> |

<br>

### [애니마켓]
- 애니마켓은 오픈형 마켓으로 보호소/기업 회원만이 자신들의 상품에 대해서 등록, 수정, 삭제 권한을 가지고 있습니다.
- 애니마켓는 비로그인 시에도 진입이 가능합니다.
- 장바구니, 리뷰는 오직 로그인 한 사용자에 한해서만 가능합니다.
- 이미지, 상품명, 가격을 클릭하면 상품 상세 페이지로 이동 할 수 있습니다.
- 상세 페이지에서 상품의 상세 정보 및 설명을 확인 할 수 있고 장바구니 담기와 리뷰를 작성할 수 있습니다.
- 최초 애니마켓 메뉴에 진입하게 되면 평점이 가장 높은 순서로 BEST 8개의 상품을 리스트하여 나열합니다.
- 전체상품보기 버튼을 통해 마켓에 등록된 모든 상품의 리스트를 볼 수 있습니다.
- 상품 리스트는 전체, 식료품, 액세서리로 카테고리가 구분되어 있습니다.
- 신상품순, 높은/낮은 가격순, 별점순, 조회순을 통해 상품 리스팅 필터도 가능합니다.
- 각 상품 리스트의 사진이나 상품명, 가격을 클릭하면 해당 상품의 상세보기 화면으로 이동이 가능합니다.
- 상품의 상세보기 화면을 통해 개인 장바구니에 상품을 담을 수 있지만, 로그인이 되어있지 않다면 불가능합니다.
- 상품의 상세보기 화면을 통해 리뷰작성이 가능하며 별점과 내용을 작성할 수 있습니다. 로그인이 되어있지 않다면 작성은 불가능합니다.

| 애니마켓                                                          |
|---------------------------------------------------------------|
| <img src="src/main/resources/static/images/capture/애니마켓.png"> |

<br>

### [애니공지]
- 애니공지는 공지사항과 Q&A로 구분하고 있습니다.
- 공지사항은 애니버스 최고관리자만 등록, 수정, 삭제를 할 수 있습니다.
- 공지사항의 목록은 번호, 제목, 작성일, 조회수,관리(최고관리자만)로 표시됩니다.
- 공지사항의 상세페이지는 제목과 정보, 내용으로 표시되고 페이네이션으로 이전/다음 공지사항을 확인할 수 있습니다.
- Q&A는 중간관리자(기업, 보호소) 및 최고관리자만 질문에 답변할 수 있습니다.
- Q&A는 로그인한 모든 회원이 질문을 등록할 수 있습니다.
- Q&A는 자주 찾는 질문과 사용자가 등록한 질문의 목록으로 표시됩니다.
- 자주 찾는 질문의 제목을 클릭 시 질문의 답변이 제목의 하단에 표시되어 자주 찾는 질문의 내용을 간편하게 확인 할 수 있습니다.
- Q&A는 중간관리자(기업, 보호소) 및 최고관리자만 질문에 답변할 수 있습니다.
- Q&A은 로그인한 모든 회원이 질문을 등록할 수 있습니다.
- 질문은 번호, 제목, 작성자, 작성일, 조회수 표시 됩니다.
- 제목을 클릭하면 질문의 상세 페이지로 이동합니다.
- 질문의 상세페이지는 제목과 정보, 내용으로 표시되고 페이네이션으로 이전/다음 질문을 확인할 수 있습니다.

| 애니공지                                                          |
|---------------------------------------------------------------|
| <img src="src/main/resources/static/images/capture/애니공지.png"> |

<br>

### [장바구니 및 결제]
- 장바구니에 담긴 상품 목록을 상품 이미지, 이름, 가격, 수량 등의 세부정보와 함께 표시합니다.
- 사용자는 품목을 선택/선택 취소하고, 수량을 직접 업데이트하고, 장바구니에서 품목을 삭제할 수 있습니다.
- 사용자가 장바구니 기능 수행 시(항목 선택/선택 취소, 수량 변경) 실시간으로 선택한 항목의 총 가격을 계산합니다.
- 결제하기 버튼을 이용하면 선택한 상품을 결제를 진행 할 수 있습니다.
- 결제하기는 결제(checkout)페이지로 이동합니다.
- 결제는 상품정보(상품명, 수량, 가격)으로 표시됩니다.
- 배송지정보(받는사람, 주소, 전화번호)로 로그인한 회원의 기본 정보로 표시 됩니다.
- 결제가격(상품가격, 배송비, 합계)로 상품가격과 배송비가 합한 합계로 표시 됩니다.
- 포인트로 결제하기 버튼을 누르면 포인트가 차감됩니다.
- 결제는 포인트 충전 후 이용할 수 있습니다.

| 장바구니 및 결제                                                     |
|---------------------------------------------------------------|
| <img src="src/main/resources/static/images/capture/장바구니.png"> |
| <img src="src/main/resources/static/images/capture/결제.png">   |

<br>

## 💥 트러블 슈팅
<details>
<summary> ❗박승수 </summary>

#### <1> <b>캘린더에서 상세페이지로 이동</b>

```문제``` FullCalendar를 사용하여 봉사활동의 전체 스케줄을 캘린더 일정에 표시하는데는 문제가 없었지만, 캘린더에 표시된 각 스케줄을 클릭했을 때 해당 상세페이지로 이동하지 않는 문제가 발생하였다.
</br></br>
```해결``` Calendar 엔티티에 어떤 봉사활동의 캘린더인지 @OneToOne 어노테이션을 사용하여 volunteer_id 외래키를 생성하고, FullCalendar 라이브러리의 특성상 객체를 JSON으로 직렬화하거나 JSON에서 역직렬화할 때 volunteer_id를 무시하도록 @JsonIgnore 어노테이션을 사용하였다.
추가로 봉사활동의 캘린더를 보여주는 JavaScript인 list.js에서 `url: event.volunteer ? /volunteer/detail/${event.volunteer.id} : null` 와 같이 주소를 매핑하여 문제를 해결하였다.
</br></br></br>

#### <2> <b>애니마켓에서 별점순으로 필터링</b>

```문제``` 애니마켓의 BSET 상품은 각 상품의 별점의 평균이 높은 순서로 8개를 추출하여 보여주는데, 엔티티 설계 시 Product 엔티티에는 별점과 관련된 컬럼이 들어가있지 않고, 각 상품의 리뷰인 Review 엔티티에 starRating 이라는 별점을 나타내는 컬럼이 있어서 단번에 별점 높은 순서의 상품을 추출하는데 문제가 발생하였다.
</br></br>
```해결``` getTopRatedProducts(8) 이라는 ProductService의 메서드를 이용하여 평균 별점이 가장 높은 8개의 상품을 추출하도록 하였고, ProductRepository에서 쿼리를 과 같이 `@Query(value = "SELECT p.* FROM product p JOIN review r ON p.id = r.product_id GROUP BY p.id ORDER BY AVG(r.star_rating) DESC, RAND() LIMIT :limit", nativeQuery = true)` 를 작성하여 Product와 Reivew를 조인하였고, 만약 동일 별점이면 랜덤으로 나타나도록 문제를 해결하였다.
</br></br></br>
</details>

<details>
<summary> ❗김진아 </summary>

#### <1> <b>jwt토큰과 시큐리티 같이 사용하기</b>

```문제``` jwt토큰을 도입 후, 관리자 관련 컨트롤러는 *.hasRole("ADMIN")을 통해 관리자의 권한을 가진 사용자만이 요청을 할 수 있도록 관리자의 인가 처리가 필요한 상황이었는데, 적용이 되지 않았다.
</br></br>
```해결```
1. jwtAuthorizationFilter에서, 토큰에서 사용자 정보를 추출해 Authentication타입의, 사용자의 인증에 필요한 정보를 시큐리티에 등록한다.
  ```java// 토큰으로부터 사용자 인증 정보 추출
            Authentication authentication = memberService.getUserFromAccessToken(accessToken)
                                                         .genAuthentication();
            // 시큐리티에 인증 정보 등록
            SecurityContextHolder.getContext().setAuthentication(authentication);
```
2. 시큐리티에서 jwtAuthorizationFilter를 UsernamePasswordAuthenticationFilter보다 먼저 적용되도록 설정코드를 추가해준다.
   ```.addFilterBefore(jwtAuthorizationFilter, UsernamePasswordAuthenticationFilter.class);```
   </br></br></br>

#### <2> <b>로그인과 로그아웃의 웹 쿠키</b>

```문제``` 로그인할 때 생성하는 웹 쿠키를 로그아웃할 때 삭제하지 못 함.
</br></br>
```해결``` 웹 쿠키는 이름이 같아도 설정된 경로가 다르면 다른 쿠키로 인식된다. 따라서, 로그인할 때 생성하는 쿠키와 로그아웃할 때 삭제하는 쿠키의 경로를 동일시 하였더니 제대로 삭제됨을 확인 하였다.
</br></br></br>
</details>

<details> 
<summary> ❗유윤하 </summary> 

#### <1> <b> 마크다운 에디터 이미지 드래그 앤 드롭 시 미리보기 렌더링 문제 </b>

```문제```  
마크다운 에디터에 이미지를 드래그 앤 드롭했을 때 텍스트 영역에는 이미지 마크다운 구문이 삽입되지만, 미리보기 화면에서 이미지가 표시되지 않는 문제가 발생했습니다.
</br></br>
```해결```  
ReactMarkdown 컴포넌트의 img 태그 렌더링을 커스터마이징하여 이미지 표시 문제를 해결했습니다. 드래그 앤 드롭된 이미지 파일에 대해 URL.createObjectURL로 임시 URL을 생성하고, 이를 상태로 관리하여 미리보기에서 이미지를 정상적으로 표시할 수 있도록 했습니다.

```typescript
const handleDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
  const file = e.dataTransfer.files[0];
  if (file?.type.startsWith("image/")) {
    const imageUrl = URL.createObjectURL(file);
    const imageKey = `image-${Date.now()}`;
    setImages(prev => ({ …prev, [imageKey]: imageUrl }));
  }
}; 
```

이를 통해 드래그 앤 드롭된 이미지가 에디터와 미리보기 양쪽에서 정상적으로 표시되도록 구현했습니다.

</br></br></br>
</details>

<details>
<summary> ❗유지훈 </summary>

#### <1> <b> 사용자가 보낸 메시지가 DB에 저장되지 않는 문제 </b>

```문제```  사용자가 메시지를 전송하면 클라이언트에서는 정상적으로 표시되지만, DB에 메시지가 저장되지 않아 이후 조회 시 메시지가 누락되는 현상이 발생.

</br></br>
```해결``` 서비스 로직에서 메시지를 저장하는 부분에서 save() 메서드 호출이 누락되거나 올바르게 호출되지 않았다.
ChatMessage 엔티티가 데이터베이스와 매핑되지 않은 경우 발생.

메시지를 저장할 때 chatMessageRepository.save()를 명시적으로 호출.
ChatMessage 엔티티에 필요한 필드와 매핑 어노테이션(@Entity, @ManyToOne 등)을 정확히 설정한다.

` @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id"),   @JoinColumn(name = "chat_room_id"), chatMessageRepository.save(chatMessage);
`

이 설정을 통해 DB에서 저장된 메시지가 정확히 조회되고, 클라이언트에서 누락 없이 메시지를 확인 가능하게 되었다.
</br></br></br>
</details>

<details>
<summary> ❗이상수 </summary>
sock.js 이용하다가 stomp.js 로 바꿈
메세지를 보낸 것과 받은 것이 제대로 구분되게 함

#### <1> <b>메세지를 방 별로 송수신</b>

```문제``` 메세지 실시간 송수신까지는 문제가 없었으나, 채팅 방 구분 없이 모든 메세지가 송수신되는 문제가 있었다.
</br></br>
```해결``` 백엔드에서는 기존 Chat 엔티티만 사용하던 것을 ChatMessage, ChatJoin, ChatRoom 으로 메세지, 방 참가자, 방 별로 세분화 하고, 프론트에서는 stomp.js의 방 구독 기능을 이용하여 채팅 방 별로 메세지 송수신을 구분하였다.
</br></br></br>

#### <2> <b>메세지 수신, 송신 구별</b>

```문제``` 메세지 실시간 전송과 채팅 방마다 메세지 구분은 되었지만, 메세지를 내가 보낸건지 상대가 보낸건지 구별할 수 없었다. 채팅 방을 나갔다가 다시 들어오면 송수신자 별로 구분이 되었지만 채팅 방에서 실시간으로 있는 동안에는 구분되지 않았다.
</br></br>
```해결``` 서버에서 송신자, 수신자를 미리 구별하고 클라이언트에서는 출력만 하는 방식으로 구현하려 했다. 채팅 기록은 이 방식으로 구현해서 되었기 때문이다. 하지만 이 방식을 사용해도 안되자 클라이언트에 로그인 정보를 가져와 수신자인지 아닌지를 구분하는 방식을 사용했다. 이미 로그인 기능으로 LocalStorage에 userEmail(로그인한 사용자의 아이디 값)이 저장되고 있었고, 이 값을 이용해 메세지 데이터에 송신자의 Email값과 비교해서 송신자인지 수신자인지를 구분해서 출력할 수 있었다.
</br></br></br>

#### <3> <b>ChatJoin 엔티티의 유니크 설정 문제</b>

```문제``` ChatJoin 엔티티는 채팅 방에 참가자를 구분하기 위해 만든 엔티티로 Member_id와 ChatRoom_id 컬럼이 있고, Member_id와 ChatRoom_id의 두 값이 모두 같은 컬럼은 하나 이상 만들어지지 못하게 설정하려고 했는데, @Column(unique=true)만으로는 해결하지 못하고 있었다.
</br></br>
```해결``` @Table(name = "chat_join", uniqueConstraints =  {@UniqueConstraint(columnNames = {"member_id", "chat_room_id"})})을 사용했다. 이 어노테이션은 "member_id", "chat_room_id" 두 컬럼을 마치 하나의 컬럼에 유니크를 적용한 것처럼 작동한다. @Column(unique=true)를 사용하면 (member_id, chat_room_id)의 값이 (1, 2), (1, 1) 인 경우 규칙을 어긴 것이지만 위 어노테이션을 사용하면 허용된다.
</br></br></br>
</details>

<details>
<summary> ❗이은철 </summary>

#### <1> <b> 게시글에 대해서 삭제 처리를 하기위해 참조되는 댓글을 삭제 하는데 트랜잭션 관련 오류 </b>

```문제```  삭제하려 할 때 Post를 참조하는 댓글이 존재하여 외래 키 제약 조건을 위반하는 문제
</br></br>
```해결``` 트랜지션만 단순하게 설정하는것이아니라 게시글 삭제 기능을 수행할때
해당 게시글의 댓글을 먼저 삭제하고 게시글을 삭제하도록 설정하였다.
@Transactional 어노테이션을 사용하여 트랜잭션 관리를 통해 Post와 관련된 PostComment들을 삭제한 후 Post를 삭제할 수 있다.
또한

`@OneToMany(mappedBy = "post", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
@OrderBy("createdDate DESC")
private List<PostComment> comments;`

이 설정을 통해 트랜잭션 처리와 함께 사용하여, 외래키 제약 조건 위반 없이 자동으로 관계가 정리되고,
추가적인 삭제 처리 없이도 Post의 삭제가 정상적으로 처리되었다.
</br></br>
</details>

## 🫸 개선해야 할 점

- 중복되는 코드 제거
    - layout.html 이라는 공통된 템플릿을 두고 사용하다보니 각 html에 대한 css을 작성할 때 혹시라도 겹치는 클래스명이나 태그가 있으면 서로 css 적용이 안되는 경우가 있었습니다.
    - 하나의 기능을 위해서 각 컨트롤러에서 중복된 코드를 사용한 경우가 있는데 프로그램의 속도 향상을 위해 코드를 간소화할 방법을 찾아봐야 할 것 같습니다.

<br>

## 🧑‍🎓 프로젝트를 마치며..

### 🍋‍🟩 박승수
이번 7명으로 구성된 팀 프로젝트의 팀장을 맡게 되어 영광이었습니다.

인원이 많은 만큼 기획부터 개발까지 기반 틀을 잘 잡고 가야 한다는 생각으로 초반 회의 때 팀원분들과 이견을 종합하여 잘 다져 나갔던 거 같습니다.

저희의 프로젝트는 저와 팀원분들의 실력 향상에 중점을 두고, 새로운 기술들을 두려워하지 않고 도전하여 성공을 이루는 계기가 되었습니다.

프론트와 백을 오고 가며, 연동시키며 모든 기능을 완성 시켰습니다.

가장 기억에 남는 기능은 WebSocket을 활용한 알림을 처음 구현해 보는 것 입니다.

실시간으로 알림 기능을 구현하며 도전하면 된다는 것을 깨닫는 중요한 프로젝트 기간이었습니다.

<br>

### 🐶 황혜현
안녕하세요!
이번 회고는 프로젝트와 학원 생활의 마무리를 담는 글이 될 것 같아요. 비록 프로젝트에 직접 참여한 비중은 크지 않았지만, 되돌아보니 함께 고민하며 구조를 잡아갔던 경험이 지금 회사 생활에도 큰 도움이 되고 있다는 점에서 참 값진 시간이었습니다.

처음 접해보는 프레임워크나 기술도 학원을 통해 배운 기초가 있었기에 비교적 수월하게 적응할 수 있었던 것 같아요. 하지만 여전히 실력에 대한 막연한 불안감은 저를 따라다니고 있습니다. 주변에서 부족하다고 지적하는 사람은 없지만, 스스로 느끼는 한계는 부정할 수 없기에 더 조급함을 느끼곤 해요.

그렇지만 돌이켜보면 이런 불안은 저를 앞으로 나아가게 하는 원동력이 되어왔습니다. 그 불안을 이겨내기 위해 노력하고, 작은 성장을 이루는 경험이 또 다른 도전을 이어가는 용기가 되어주었으니까요.

이번 회고를 통해 여러분께 꼭 전하고 싶은 메시지가 있다면, 스스로를 너무 몰아붙이지 말았으면 좋겠다는 것입니다. 적당한 불안과 자극은 발전의 원천이 될 수 있지만, 지나친 자기 질책은 생각보다 크게 도움이 되지 않는다는 걸 인생을 살아가며 깨닫게 되었습니다. (가끔은 뻔뻔한게 정신건강에 이로울지도 ,,ㅎㅎ)

만약 오늘 하루가 부족했다면 더 나은 내일을 기약하며 꿀잠 주무시고, 오늘이 만족스러웠다면 스스로에게 작은 칭찬(선물)이라도 하며 자신감을 채워주세요.

여러분이 학원을 떠나 사회로 나아가게 될 때, 흔들릴 수는 있지만 절대 꺾이지 않는 마음을 가지길 바랍니다. 여러분의 앞날에 응원을 보냅니다.(화이팅,,)

중꺾마 (중요한 건 꺾이지 않는 마음)
from 지옥으로부터

<br>

### 🚌 김진아
스프링 시큐리티와 JWT를 함께 사용하며 발생한 문제를 해결하면서 두 라이브러리를 더 이해할 수 있는 기회가 되었습니다.

저희 팀은 '벨로그'의 글 에디터를 인상깊게 보아, 글을 작성하는 동시에 미리보기를 볼 수 있도록 하였습니다. 해당 부분의 프론트엔드를 맡게 되어 숙련도를 한 층 더 높힐 수 있는 시간이였습니다.

팀장님을 비롯해 모든 팀원이 좋은 분위기 속에서 작업을 할 수 있도록 도와주어서 안정적이고 즐거웠습니다.

<br>

### 👑 유윤하
이번 프로젝트에서 react와 scss를 사용하고 배우지 않았던 next.js를 사용함으로써 새로운 기술을 적용하는데 초기에 어려움이 있었습니다.

하지만 부팀장님의 체계적인 기반을 구축 해주신 덕분에 새로운 기술을 사용하는것이 수월해졌습니다.

팀장님과 팀원들이 각자 맡은 업무에 최선을 다하는 모습에 자극받아 저 역시 더욱 책임감을 가지고 이번 프로젝트에 임했습니다. 팀원의 부재로 약간의 어려움이 있었지만, 남은 팀원들이 서로의 부족한 부분을 도와줌으로써 성공적으로 프로젝트를 마무리할 수 있었습니다.

<br>

### 🚌 유지훈
이번 프로젝트에서 채팅 기능 구현을 통해 실시간 통신 기술의 중요성을 깊이 깨달았습니다.

WebSocket을 활용해 사용자 간 원활한 소통을 구현했으며, 초기 연결 설정과 메시지 송수신 처리에 중점을 두었습니다.

개발 과정에서 비동기 데이터 동기화 문제를 해결하며 성능 최적화와 사용자 경험 개선에 노력했습니다.

이를 통해 협업과 커뮤니케이션의 본질을 기술적으로 재현할 수 있었고, 프로젝트의 완성도를 높일 수 있었습니다. 앞으로 확장성을 고려한 구조 설계와 다양한 기능 추가를 목표로 발전시키고자 합니다.

<br>

### 👑 이상수
이번 프로젝트에서 채팅 풀스택을 전담하게 되었습니다.

프로젝트를 진행하며 어려웠던 부분은 백엔드와 프론트엔드의 연동이였습니다.

특히 송신자 채팅 표시, 채팅 과거 기록 불러오기, 채팅 방 분리와 관련된 문제가 있었습니다.

처음에는 로그인한 유저와 관계없이 모든 채팅 메시지가 구분 없이 표시되는 문제가 있었습니다.

이를 해결하기 위해 DB 구조를 재설계하고, 클라이언트에서 로그인한 사용자 정보를 기반으로 메시지를 구분할 수 있도록 개선했습니다.

채팅방을 이동할 때마다 이전 채팅 기록이 사라지는 문제와 채팅 방 구분 없이 메시지가 전역으로 송수신되는 문제도 DB 구조를 개선해서 해결했습니다.

이번 프로젝트로 채팅 기능을 맡으면서 소캣기능과 Next.js를 사용해본 것은 유익한 경험이였습니다.

<br>

### 🚌 이은철
프로젝트 백엔드 포스트 담당으로 REST API 형태의 개발로 진행하면서 단순히 로직 작성으로 끝나는 것이 아니라 유효성 검사 및 예외 처리, 연동, 보안 등 신경 써야 할 부분이 많다는 것을 배웠습니다. 

또한 간결하고 안정적인 구조를 만드는 것의 중요성을 알게 되었습니다. 

마지막으로 팀장, 팀원들과 의사소통을 통해 더 나은 방안을 찾을 수 있어 프로젝트를 원할히 마무리 할 수 있게 되었습니다.

<br>

## 🔗Link

[프로젝트 완성 및 시연 영상]()