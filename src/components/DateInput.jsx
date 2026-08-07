import { useState } from "react";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function DateInput({
  label,
  value,
  onChange,
  required = false,
  error,
  helper,
  min,
  max,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="date-input-group">
      {label && (
        <label className="date-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}

      <DatePicker
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        openTo="year"
        views={["year", "month", "day"]}
        value={value ? dayjs(value) : null}
        onChange={(date) =>
          onChange({
            target: {
              value: date ? date.format("YYYY-MM-DD") : "",
            },
          })
        }
        format="DD/MM/YYYY"
        minDate={min ? dayjs(min) : undefined}
        maxDate={max ? dayjs(max) : dayjs()}
        slotProps={{
          textField: {
            fullWidth: true,
            error: !!error,
            helperText: error || helper,

            onClick: () => setOpen(true),

            sx: {
              cursor: "pointer",

              "& .MuiInputBase-input": {
                cursor: "pointer",
              },

              "& .MuiOutlinedInput-root": {
                height: 52,
                borderRadius: "12px",

                "& fieldset": {
                  borderColor: "#d1d5db",
                },

                "&:hover fieldset": {
                  borderColor: "#003399",
                },

                "&.Mui-focused fieldset": {
                  borderColor: "#003399",
                },
              },
            },
          },
        }}
      />
    </div>
  );
}