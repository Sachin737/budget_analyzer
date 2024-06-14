import * as React from "react";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import { useState } from "react";

const BasicDatePicker = () => {
  const [value, setValue] = useState(dayjs("2022-04-17"));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={["DateTimePicker"]}
        sx={{
          paddingTop: "22px",
        }}
      >
        <DateTimePicker
          label="purchase date"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          sx={{
            "& .MuiInputBase-input": {
              color: "white",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "white",
              },
              "&:hover fieldset": {
                borderColor: "white",
              },
              "&.Mui-focused fieldset": {
                borderColor: "white",
              },
            },
            "& .MuiInputLabel-root": {
              color: "white",
            },
            "& .MuiSvgIcon-root": {
              color: "white",
            },
          }}
          InputProps={{
            sx: {
              color: "white",
            },
          }}
          InputLabelProps={{
            sx: {
              color: "white",
            },
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default BasicDatePicker; 
