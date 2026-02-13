import SvgColor from 'src/components/svg-color';

import ic_analytics from '../../assets/icons/navbar/ic_analytics.svg';
import clock_rotate_left_solid from '../../assets/icons/navbar/clock-rotate-left-solid.svg';
import ic_magnifying_glass_solid from '../../assets/icons/navbar/ic_magnifying-glass-solid.svg';
// ----------------------------------------------------------------------

const navConfig = [
  {
    title: 'dashboard',
    path: '/',
    icon: <SvgColor src={ic_analytics} sx={{ width: 1, height: 1 }} />,
  },

  {
    title: 'inspection',
    path: '/inspection',
    icon: <SvgColor src={ic_magnifying_glass_solid} sx={{ width: 1, height: 1 }} />,
  },
  {
    title: 'History',
    path: '/history/1',
    icon: <SvgColor src={clock_rotate_left_solid} sx={{ width: 1, height: 1 }} />,
  },
 
];

export default navConfig;
