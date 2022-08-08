import { makeStyles, Typography } from "@material-ui/core";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import CustomInlineEditor from "ckeditor5-custom-build/build/ckeditor";
import { useSelector } from "react-redux";

import { getAuth } from "../../application/reducers/authSlice";
import throttle from "lodash.throttle";

// ----
import draftToHtml from "draftjs-to-html";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& .ck": {
      border: "1px solid #00000038 !important",
      lineHeight: 1.5,
      borderRadius: "4px !important",
      fontSize: "0.9rem",
    },
    "& .ck:hover:not(.ck-focused)": {
      border: "1px solid #061B27 !important",
    },
    "& .ck-focused": {
      border: "1px solid red !important",
    },
    "& .ck.ck-editor__editable > .ck-placeholder::before": {
      color: "gray",
    },
  },
  errorP: {
    fontSize: "0.75rem",
    color: "#d32f2f",
    margin: "3px 14px 0",
  },
}));

const getEditorConfiguration = ({ token, placeholder }) => ({
  placeholder,
  toolbar: [
    "Alignment",
    "Autoformat",
    "AutoLink",
    "Bold",
    "Essentials",
    "FontBackgroundColor",
    "FontColor",
    "FontSize",
    "Highlight",
    "HorizontalLine",
    "Image",
    "ImageResize",
    "ImageStyle",
    "ImageToolbar",
    "ImageUpload",
    "Indent",
    "IndentBlock",
    "Italic",
    "Link",
    "List",
    "ListStyle",
    "Paragraph",
    "PasteFromOffice",
    "SimpleUploadAdapter",
    "Table",
    "TableCellProperties",
    "TableProperties",
    "TableToolbar",
    "Underline",
  ],
  // plugins: [SimpleUploadAdapter],
  simpleUpload: {
    // The URL that the images are uploaded to.
    uploadUrl: "http://example.com",

    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
});

const throttleValueChange = throttle((func) => func(), 1000, {
  leading: true,
});

export default function DraftEditor({
  initialValue,
  setFieldValue,
  name,
  handleQuestion,
  index,
  placeholder,
  error,
  handleFormData = () => {},
}) {
  const classes = useStyles();
  const auth = useSelector(getAuth);

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [convertedContent, setConvertedContent] = useState("<h1>ok</h1>");
  const handleEditorChange = (state) => {
    console.log(state, ">>this is state");
    setEditorState(state);
    // convertContentToHTML();
    let currentContentAsHTML = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    if (name == "questionTitle" || name == "explaination")
      handleQuestion({ target: { name, value: currentContentAsHTML } });
    else handleFormData(index, currentContentAsHTML);
    setConvertedContent(currentContentAsHTML);
  };
  const convertContentToHTML = () => {
    // {draftToHtml(convertToRaw(editorState.getCurrentContent()))}
    let currentContentAsHTML = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    // let htmlConverted = convertImageStyling(currentContentAsHTML);
    setConvertedContent(currentContentAsHTML);
    setFieldValue(name, currentContentAsHTML);
    handleFormData({ target: { name, value: currentContentAsHTML } });
    // setConvertedContent(htmlConverted);
  };
  const uploadImageCallBack = (imageAdd) => {
    // console.log(file, "thsii is file")

    return new Promise((resolve, reject) => {
      console.log(imageAdd, "handle image called");
      // console.log("handleUpload called")
      const data = new FormData();
      data.append("file", imageAdd);
      data.append("upload_preset", "quinkpost");
      data.append("cloud_name", "Quink-Post");
      console.log("before cloud post");

      fetch("https://api.cloudinary.com/v1_1/quink-post/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data, "this is data from cloudinakdfj");
          // setimage(data.secure_url);
          resolve({ data: { link: data.secure_url } });
          // resolve(data.url)
          console.log(data.url, "<<<<<<<thii si rurl");
        });
    });
  };
  // console.log(convertedContent, "<<<<<converted content");
  return (
    <div className={classes.root}>
      {/* <CKEditor
        editor={CustomInlineEditor}
        config={getEditorConfiguration({ token: auth.token, placeholder })}
        data={initialValue || ""}
        onChange={(_, editor) => {
          const data = editor.getData();

          throttleValueChange(() => setFieldValue(name, data));
        }}
      /> */}
      <Editor
        editorState={editorState}
        toolbar={{
          image: {
            uploadCallback: uploadImageCallBack,
            alt: { present: true, mandatory: false },
          },
        }}
        onEditorStateChange={handleEditorChange}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
      />
      <p className={classes.errorP}>{error}</p>
    </div>
  );
}
