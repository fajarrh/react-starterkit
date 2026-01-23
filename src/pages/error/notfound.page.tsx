import Link from "@mui/material/Link";
import { useNavigate } from "react-router";

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: "center", padding: "32px" }}>
      Page not found
      <br/>
      <span>
        <Link
          component="button"
          variant="body2"
          fontWeight={700}
          onClick={() => {
            navigate(-1);
          }}
        >
          Go Back
        </Link>
      </span>
    </div>
  );
};

export default PageNotFound;
