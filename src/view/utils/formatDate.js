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
// export const BACKEND_URL = "http://localhost:8000";
export const BACKEND_URL = "https://dental--backend.herokuapp.com";
export const DENTAL_ADMIN_USER = "DENTAL_ADMIN_USER";
export const DENTAL_ADMIN_TOKEN = "DENTAL_ADMIN_TOKEN";
export default formatDate;
