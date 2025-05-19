import { CONFIG } from 'src/config-global';

import { ConferenceView } from 'src/sections/user/view/conference-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Conference - ${CONFIG.appName}`}</title>

      <ConferenceView />
    </>
  );
}
