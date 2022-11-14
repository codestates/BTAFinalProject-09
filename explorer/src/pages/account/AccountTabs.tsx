import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useRouter } from 'next/router';

type TabValue = 'transactions' | 'coins';

export default function AccountTabs({ tab }: { tab: TabValue }) {
  const router = useRouter();
  const address =
    typeof router.query.address === `string` ? router.query.address : ``;

  const handleChange = (event: React.SyntheticEvent, newTab: string) => {
    router.push(`/account/${address}/${newTab}`);
  };

  return (
    <Tabs value={tab} onChange={handleChange} aria-label="account tabs">
      <Tab label="Transactions" value="transactions" />
      <Tab label="Coins" value="coins" />
    </Tabs>
  );
}
