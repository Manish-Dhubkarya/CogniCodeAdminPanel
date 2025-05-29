import { CONFIG } from 'src/config-global';

import LogoutView from 'src/sections/user/view/logout-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Logout - ${CONFIG.appName}`}</title>

      <LogoutView />
    </>
  );
}
