import Link from "@mui/material/Link";
import { useNavigate } from "react-router";

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: "center", padding: "16px" }}>
      Page not found {" "}
      <span>
        <Link
          component="button"
          variant="body2"
          onClick={() => {
            navigate(-1);
          }}
        >
          go back.
        </Link>
      </span>
    </div>
  );
};

export default PageNotFound;
