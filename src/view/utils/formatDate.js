const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString("en-US", {
    //  weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    // second: "numeric",
  });
};
// export const BACKEND_URL="http://localhost:8000"
export const BACKEND_URL = "https://dental--backend.herokuapp.com";

export default formatDate;
