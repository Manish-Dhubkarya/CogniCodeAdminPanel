import { GiProgression } from "react-icons/gi";

import { Label } from 'src/components/label';
import { FaUsers } from "react-icons/fa";
import { GiVideoConference } from "react-icons/gi";
import { GiPublicSpeaker } from "react-icons/gi";
import { GiPropellerBeanie } from "react-icons/gi";
import { FaBlog } from "react-icons/fa";
import { LiaSignInAltSolid } from "react-icons/lia";
import { LuCloudOff } from "react-icons/lu";


export type NavItem = {
  title: string;
  path: string;
  icon: React.ElementType;
  info?: React.ReactNode;
};

export const  navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: GiProgression,
  },
  {
    title: 'User',
    path: '/user',
    icon: FaUsers,
  },
    {
    title: 'Conference',
    path: '/conference',
    icon: GiVideoConference,
  },
    {
    title: 'Publication',
    path: '/publication',
    icon: GiPublicSpeaker,
  },
  {
    title: 'Product',
    path: '/products',
    icon: GiPropellerBeanie,
    info: (
      <Label color="error" variant="inverted">
        +3
      </Label>
    ),
  },
  {
    title: 'Blog',
    path: '/blog',
    icon: FaBlog,
  },
  {
    title: 'Logout',
    path: '/logout',
    icon: LiaSignInAltSolid,
  },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: LuCloudOff,
  // },
];
