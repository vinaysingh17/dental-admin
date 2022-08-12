// import { useState } from "react";
// import { useDispatch } from "react-redux";
// // import { fetchSubjects } from "../../application/reducers/subjectSlice";
// import {
//   Typography,
//   FormControl,
//   Select,
//   FormLabel,
//   OutlinedInput,
//   FormControlLabel,
//   TextField,
//   Button,
//   Breadcrumbs,
//   Link,
//   MenuItem,
//   RadioGroup,
//   Radio,
//   styled,
// } from "@mui/material";

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// };
// const StyledFormLabel = styled(FormLabel)({
//   marginTop: 30,
// });

// const subjects = [1, 2, 3];

// export default function QuestionBank() {
//   const [subject, setSubject] = useState([]);

//   const handleChange = (event) => {
//     const {
//       target: { value },
//     } = event;
//     setSubject(
//       // On autofill we get a the stringified value.
//       typeof value === "string" ? value.split(",") : value
//     );
//   };
//   const dispatch = useDispatch();
//   // dispatch(fetchSubjects());

//   return (
//     <div
//       style={{
//         width: "85vw",
//         height: "100%",
//         overflow: "auto",
//         position: "fixed",
//         right: 0,
//       }}
//     >
//       <div
//         style={{
//           backgroundColor: "#ebd9d8",
//           position: "relative",
//           top: 0,
//           height: "230%",
//           width: "100%",
//           display: "flex",
//           alignItems: "center",
//           flexDirection: "column",
//         }}
//       >
//         <div
//           style={{
//             height: "8vh",
//             width: "90%",
//             backgroundColor: "#ffedef",
//             position: "absolute",
//             top: "13vh",
//             display: "flex",
//             alignItems: "center",
//             paddingLeft: "2%",
//           }}
//         >
//           <ActiveLastBreadcrumb />
//         </div>
//         <div
//           style={{
//             width: "92%",
//             backgroundColor: "#ffffff",
//             position: "absolute",
//             top: "25vh",
//             display: "flex",
//             flexDirection: "column",
//           }}
//         >
//           <div style={{ display: "flex", justifyContent: "space-between" }}>
//             <Typography
//               variant="h5"
//               sx={{ textAlign: "left", margin: "3%", color: "#484848" }}
//             >
//               Question Bank
//             </Typography>
//             <Button
//               sx={{
//                 color: "white",
//                 backgroundColor: " #69d6a8",
//                 height: 50,
//                 borderRadius: 12,
//                 width: "12rem",
//                 margin: "3%",
//               }}
//             >
//               Add new +
//             </Button>
//           </div>

//           <FormControl sx={{ m: 1, width: "94%", marginLeft: "3%" }}>
//             <FormLabel sx={{ textAlign: "left" }}>Subject</FormLabel>

//             <Select
//               labelId="multiple-type-label"
//               id="multiple-type"
//               multiple
//               value={subject}
//               onChange={handleChange}
//               input={<OutlinedInput label="Subject" />}
//               MenuProps={MenuProps}
//             >
//               {subjects.map((name) => (
//                 <MenuItem key={name} value={name}>
//                   {name}
//                 </MenuItem>
//               ))}
//             </Select>
//             <div style={{ display: "flex", width: "100%" }}>
//               <div style={{ flex: 1 }}>
//                 <StyledFormLabel component="legend" sx={{ textAlign: "left" }}>
//                   Topic
//                 </StyledFormLabel>
//                 <TextField
//                   id="outlined-options-input"
//                   label="Enter no of options"
//                   type="text"
//                   sx={{ marginTop: "8%" }}
//                 />
//               </div>
//               <div style={{ flex: 1 }}>
//                 <StyledFormLabel component="legend" sx={{ textAlign: "left" }}>
//                   Sub Topic
//                 </StyledFormLabel>
//                 <TextField
//                   id="outlined-options-input"
//                   label="Enter no of options"
//                   type="text"
//                   sx={{ marginTop: "8%" }}
//                 />
//               </div>
//             </div>

//             <br />
//             <br />
//             <StyledFormLabel component="legend" sx={{ textAlign: "left" }}>
//               Level
//             </StyledFormLabel>
//             <RadioGroup row aria-label="level" name="row-radio-buttons-group">
//               <FormControlLabel value="easy" control={<Radio />} label="Easy" />
//               <FormControlLabel
//                 value="medium"
//                 control={<Radio />}
//                 label="Medium"
//               />
//               <FormControlLabel value="hard" control={<Radio />} label="Hard" />
//             </RadioGroup>

//             <Button
//               sx={{ marginTop: 5, marginBottom: 5, width: "20%" }}
//               variant="contained"
//             >
//               Filter
//             </Button>
//           </FormControl>
//         </div>
//       </div>
//     </div>
//   );
// }

// function handleClick(event) {
//   event.preventDefault();
// }
// function ActiveLastBreadcrumb() {
//   return (
//     <div role="presentation" onClick={handleClick}>
//       <Breadcrumbs aria-label="breadcrumb">
//         <Link underline="hover" color="text.primary" href="/">
//           Home
//         </Link>
//         <Link underline="hover" color="text.primary" href="/">
//           Questions
//         </Link>
//         <Link underline="hover" color="text.primary" href="/">
//           Question Types
//         </Link>
//         <Link underline="hover" color="inherit" href="/" aria-current="page">
//           MCQs
//         </Link>
//       </Breadcrumbs>
//     </div>
//   );
// }

import { Container, Paper, Drawer } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { useState } from "react";
import QuestionTable from "./QuestionTable";
import QuestionForm from "./QuestionForm";
import { useParams } from "react-router-dom";

const useStyles = makeStyles(() => ({
  root: {
    padding: 0,
    display: "flex",
    flexDirection: "column",
    rowGap: "2rem",
  },
  roundPaper: {
    overflow: "hidden",
  },
  headerDiv: {
    display: "flex",
    alignItems: "center",
    padding: "2rem",
  },
  addNewQuestionImg: {
    width: "4rem",
    display: "block",
    margin: "auto",
    marginBottom: 5,
  },
  filtersCont: {
    marginLeft: "auto",
    width: "60%",
  },
  filtersDiv: {
    display: "flex",
    columnGap: "1.5rem",
    "& > div": {
      flex: 1,
    },
  },
  headerLabel: {
    fontSize: "0.9rem",
    color: "#030303",
    fontWeight: 600,
    marginBottom: 2,
  },
  grayColor: {
    color: "#7A899F",
  },
}));

export default function Home() {
  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState(false);
  const params = useParams();
  const [filter, setFilter] = useState({
    subject: null,
    topic: null,
    subtopic: null,
    questionType: "EASY",
  });

  const toggleDrawer = (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setOpenDrawer((open) => !open);
  };
  return (
    <Container className={classes.root}>
      <Paper variant="elevation" className={classes.roundPaper}>
        <QuestionTable filter={filter} openFilterDrawer={toggleDrawer} />
        <Drawer anchor={"right"} open={openDrawer} onClose={toggleDrawer}>
          <QuestionForm
            filterState={[filter, setFilter]}
            closeForm={toggleDrawer}
          />
        </Drawer>
      </Paper>
    </Container>
  );
}
