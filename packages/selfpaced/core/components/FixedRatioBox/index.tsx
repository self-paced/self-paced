import { Box, SxProps, Theme } from '@mui/material';

interface Props {
  children?: React.ReactNode;
  ratio: number;
  width: string;
  sx?: SxProps<Theme>;
}

const FixedRatioBox: React.FC<Props> = ({ ratio, width, sx, children }) => {
  return (
    <Box
      sx={{
        width,
        position: 'relative',
        objectFit: 'cover',
        ...sx,
      }}
    >
      <Box
        sx={{
          paddingBottom: `${ratio * 100}%`,
        }}
      />
      {children}
    </Box>
  );
};

export default FixedRatioBox;
