
  create table tblCandidate(
  candidateId int identity(1,1) primary key,
  firstname nvarchar(255),
  lastname nvarchar(255),
  email nvarchar(255),
  mobile nvarchar(255),
  resident nvarchar(255),
  resumeUrl nvarchar(1000),
  createdAt datetime default getdate()
  )
  
  create table tblClient(
  clientId int identity(1,1) primary key,
  firstname nvarchar(255),
  lastname nvarchar(255),
  email nvarchar(255),
  mobile nvarchar(100),
  message nvarchar(3000),
  createdAt datetime default getdate()
  )
  
  create table tblUsers(
  userId int identity(1,1) primary key,
  firstname nvarchar(255),
  lastname nvarchar(255),
  email nvarchar(255) unique,
  password nvarchar(255),
  role nvarchar(50) check (role in('admin','user')),
  isDeleted bit default 0,
  updateAt datetime default null,
  createdAt datetime default getdate(),
  )

  create table tblCategory(
  categoryId int identity(1,1) primary key,
  categoryName nvarchar(100),
  isActive bit default 1
  )

  create table tableDifficulty(
  difficultyId int identity(1,1) primary key,
  difficultyName nvarchar(100),
  isActive bit default 1)

  create table tblCourses(
  courseId int identity(1,1) primary key,
  categoryId int foreign key references tblCategory(categoryId),
  courseTitle nvarchar(500) not null,
  courseDecription nvarchar(1000),
  previewLink nvarchar(1000),
  authorName nvarchar(100),
  authorDescription nvarchar(2000),
  isActive bit default 1,
  isDeleted bit default 0,
  createdAt dateTime default getdate()
  )

  create table tblCourseModules(
  moduleId int identity(1,1) primary key,
  courseId int foreign key references tblCourses(courseId),
  moduleTitle nvarchar(1000),
  moduleDescription nvarchar(1000),
  isActive bit default 1,
  isDeleted bit default 0,
  createdAt datetime default getdate())
  
  create table tblCourseModuleChapters(
  chapterId int identity(1,1) primary key,
  moduleId int foreign key references tblCourseModules(moduleId),
  chapterTitle nvarchar(1000),
  chapterDescription nvarchar(1000),
  chapterUrl nvarchar(1000),
  isActive bit default 1,
  isDeleted bit default 0,
  createdAt datetime default getdate()
  )

  create table tblExams(
  examId int identity(1,1) primary key,
  categoryId int foreign key references tblCategory(categoryId),
  examTitle nvarchar(520),
  examDescription nvarchar(1000),
  examDuration nvarchar(50),
  isActive bit default 1,
  isDeleted bit default 0,
  createdAt datetime default getdate()
  )

  create table tblExamQuestions(
  questionId int identity(1,1) primary key,
  examId int foreign key references tblExams(examId),
  difficultyId int foreign key references tblDifficulty(difficultyId),
  question nvarchar(1000),
  isActive bit default 1,
  isDeleted bit default 0,
  createdAt datetime default getdate()
  )
 
  create table tblQuestionOptions(
  optionId int identity(1,1) primary key,
  questionId int foreign key references tblExamQuestions(questionId),
  optionName nvarchar(520),
  isCorrect bit,
  isActive bit default 1,
  isdeleted bit default 0
  )

  create table tblExamAttempts(
  attemptId int identity(1,1) primary key,
  examId int not null foreign key references tblExams(examId),
  userId int not null foreign key references tblUsers(userId),
  startTime datetime,
  endTime datetime,
  score nvarchar(520),
  isDelete bit default 0,
  isActive bit default 1,
  createdAt datetime default getdate()
  )

  create table tblExamAttemptAnswers(
  answerId int identity(1,1) primary key,
  attemptId int not null foreign key references tblExamAttempts(attemptId),
  questionId int not null foreign key references tblExamQuestions(questionId),
  optionId int not null foreign key references tblQuestionOptions(optionId),
  difficultyId int not null foreign key references tblDifficulty(difficultyId),
  isActive bit default 1,
  isDeleted bit default 0,
  createdAt datetime default getdate()
  )

  create table tblHidr8Waitlist(
  uniqueId int identity(1,1) primary key,
  name nvarchar(100),
  email nvarchar(250),
  mobile nvarchar(100),
  resident nvarchar(250),
  message nvarchar(1000),
  createdAt datetime default getdate()
  )

  
