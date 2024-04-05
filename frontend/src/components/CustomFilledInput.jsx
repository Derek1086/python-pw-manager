import { useState } from "react";
import FilledInput from "@mui/material/FilledInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

function CustomFilledInput({ type, id, value, error, content, onChange }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  if (type === "password") {
    return (
      <FormControl variant="filled">
        <InputLabel color="secondary" htmlFor={id} error={error}>
          {content}
        </InputLabel>
        <FilledInput
          id={id}
          type={showPassword ? "text" : "password"}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? (
                  <VisibilityOff color="secondary" />
                ) : (
                  <Visibility color="secondary" />
                )}
              </IconButton>
            </InputAdornment>
          }
          color="secondary"
          size="small"
          required={true}
          onChange={(e) => onChange(e.target.value)}
          value={value}
          inputProps={{ maxLength: 25 }}
          error={error}
        />
      </FormControl>
    );
  }

  return (
    <FormControl variant="filled">
      <InputLabel color="secondary" htmlFor={id} error={error}>
        {content}
      </InputLabel>
      <FilledInput
        id={id}
        color="secondary"
        size="small"
        required={true}
        onChange={(e) => onChange(e.target.value)}
        value={value}
        inputProps={{ maxLength: 25 }}
        error={error}
      />
    </FormControl>
  );
}

export default CustomFilledInput;
