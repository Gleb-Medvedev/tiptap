import { Tooltip, Box, Typography } from "@mui/material";

type ToolbarTooltipProps = {
  label: string;
  keyCommand?: string;
  children: React.JSX.Element;
};

const ToolbarButtonTooltip = ({ label, keyCommand, children }: ToolbarTooltipProps) => (
  <Tooltip
    arrow
    title={
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <span>{label}</span>
        {keyCommand && (
          <Typography variant="caption" sx={{ opacity: 0.7, textAlign: 'center' }}>
            <span>CTRL + {keyCommand}</span>
          </Typography>
        )}
      </Box>
    }
    placement="top"
  >
    {children}
  </Tooltip>
);

export default ToolbarButtonTooltip;
