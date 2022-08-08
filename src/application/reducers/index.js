import auth from "./authSlice";
import ui from "./uiSlice";
import subject from "./subjectSlice";
import topic from "./topicSlice";
import subTopic from "./subTopicSlice";
import global from "./globalSlice";
import question from "./questionSlice";

const reducers = {
  auth,
  ui,
  subject,
  topic,
  subTopic,
  global,
  question,
};

export default reducers;
