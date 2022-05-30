import { Box, SxProps, Theme } from '@mui/material';

const FixedRatioBox: React.FC<{
  ratio: number;
  width: string;
  sx?: SxProps<Theme>;
}> = ({ ratio, width, sx, children }) => {
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
