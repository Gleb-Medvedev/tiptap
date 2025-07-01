import { Tooltip, Box, Typography } from "@mui/material";
import { Divider } from "@mui/material";

type ToolbarTooltipProps = {
  label: string;
  additionalInfo?: string;
  children: React.JSX.Element;
};

const ToolbarButtonTooltip = ({ label, additionalInfo, children }: ToolbarTooltipProps) => (
  <Tooltip
    arrow
    title={
      <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
        <span style={{padding: '4px', letterSpacing: '.2px', fontSize: '.75rem'}}>{label}</span>
        {additionalInfo && <Divider color='#fff'/>}
        {additionalInfo && (
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            <span>{additionalInfo}</span>
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
