import subjectService from "./subjectService";
import authService from "./authService";
import topicService from "./topicService";
import subTopicService from "./subTopicService";
import questionService from "./questionService";
import userService from './userService'

const services = {
  auth: authService,
  subject: subjectService,
  topic: topicService,
  subTopic: subTopicService,
  question: questionService,
  user: userService
};

export default services;
