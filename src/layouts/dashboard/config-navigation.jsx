import SvgColor from 'src/components/svg-color';

import ic_user from '../../assets/icons/navbar/ic_user.svg';
import ic_analytics from '../../assets/icons/navbar/ic_analytics.svg';
import ic_cube_solid from '../../assets/icons/navbar/ic_cube_solid.svg';
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
    title: 'user',
    path: '/user',
    icon: <SvgColor src={ic_user} sx={{ width: 1, height: 1 }} />,
  },
  {
    title: 'partMaster',
    path: '/partMaster',
    icon: <SvgColor src={ic_cube_solid} sx={{ width: 1, height: 1 }} />,
  },
];

export default navConfig;
