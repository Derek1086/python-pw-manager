import CircularProgress from "@mui/material/CircularProgress";

const LoadingIndicator = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        padding: "20px",
      }}
    >
      <CircularProgress color="secondary" />
    </div>
  );
};

export default LoadingIndicator;
