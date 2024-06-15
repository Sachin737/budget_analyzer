import * as React from "react";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { useState } from "react";

const BasicDatePicker = ({ setlectedDate, setSetlectedDate }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={["DatePicker"]}
        sx={{
          paddingTop: "22px",
        }}
      >
        <DatePicker
          label="purchase date"
          value={setlectedDate}
          onChange={(newValue) => {
            // console.log("New Date:", newValue);
            setSetlectedDate(newValue);
          }}
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
