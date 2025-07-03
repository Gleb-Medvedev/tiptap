import { Tooltip, Box, Typography } from "@mui/material";
import { Divider } from "@mui/material";
import type { FC } from "react";

interface ToolbarTooltipProps {
  label: string;
  additionalInfo?: string;
  children: React.JSX.Element;
};

const ToolbarButtonTooltipStyles = {
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',

  '& > span': {
    padding: '4px',
    letterSpacing: '.2px',
    fontSize: '.75rem',
  }

} as const;

const ToolbarButtonTooltip: FC<ToolbarTooltipProps> = ({ label, additionalInfo, children }) => {
  const isDisabled = children?.props?.disabled;

  if (isDisabled) {
    return children;
  }

  return (    
    <Tooltip
      arrow
      title={
        <Box sx={ToolbarButtonTooltipStyles}>
          <span>{label}</span>
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
  )
}

export default ToolbarButtonTooltip;
