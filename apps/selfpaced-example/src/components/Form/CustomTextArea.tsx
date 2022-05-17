import { Box, SxProps, TextField, Theme } from '@mui/material';
import { FieldProps } from 'formik';
import * as React from 'react';

type Props = FieldProps & {
  placeholder?: string;
  sx?: SxProps<Theme>;
};

const CustomTextArea: React.FC<Props> = ({ sx, field, form, ...props }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <Box
      onClick={() => {
        if (inputRef.current) {
          inputRef.current.focus();
          const end = inputRef.current.value.length;
          inputRef.current.setSelectionRange(end, end);
        }
      }}
      sx={{
        border: 'solid 1px gray',
        borderRadius: '3px',
        cursor: 'text',
        padding: '5px 12px',
        ...sx,
      }}
    >
      <TextField
        inputRef={inputRef}
        fullWidth
        multiline
        variant="standard"
        InputProps={{
          disableUnderline: true,
        }}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => form.setFieldValue(field.name, e.currentTarget.value)}
        disabled={form.isSubmitting}
        {...props}
      />
    </Box>
  );
};

export default CustomTextArea;
