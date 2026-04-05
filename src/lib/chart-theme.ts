// Chart color palette matching the dark theme in globals.css
export const CHART_THEME = {
  grid: '#2a2b31',
  text: '#9698a0',
  tooltipBg: '#191a1e',
  tooltipBorder: '#2a2b31',
  primary: '#B92432',
  secondary: '#6b7280',
  positive: '#22c55e',
  negative: '#ef4444',
  area1: 'rgba(185, 36, 50, 0.15)',
  area2: 'rgba(107, 114, 128, 0.15)',
};

export const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: CHART_THEME.tooltipBg,
    border: `1px solid ${CHART_THEME.tooltipBorder}`,
    borderRadius: '6px',
    fontSize: '12px',
  },
};

export const AXIS_TICK = {
  fill: CHART_THEME.text,
  fontSize: 11,
};
