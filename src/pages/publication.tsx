import { CONFIG } from 'src/config-global';
import { PublicationView } from 'src/sections/user/view/publication-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Publications - ${CONFIG.appName}`}</title>

      <PublicationView />
    </>
  );
}
