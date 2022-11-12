import TextField, { TextFieldProps } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { FC, useCallback, useState } from 'react';
import isNumeric from 'utils/isNumeric';
import { useRouter } from 'next/router';
import api from 'services/api';

const SearchBar: FC<TextFieldProps> = (props) => {
  const [keyword, setKeyword] = useState<string>(``);
  const router = useRouter();

  const searchAndRoute = useCallback(async () => {
    if (isNumeric(keyword)) {
      const keywordNum = parseInt(keyword);
      const isBlock = await api
        .getBlockByHeight(keywordNum, false)
        .catch(() => false);
      if (isBlock) {
        router.push(`/block/${keywordNum}`);
        return;
      }
      router.push(`/txn/${keywordNum}`);
      return;
    }

    const tx = await api.getTransactionByHash(keyword).catch(() => false);
    if (typeof tx === `object` && `version` in tx) {
      router.push(`/txn/${tx.version}`);
      return;
    }

    // else account
    router.push(`/account/${keyword}`);
  }, [keyword, router]);

  return (
    <TextField
      placeholder="Search..."
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      variant="outlined"
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      onKeyPress={(e) => {
        if (e.key === `Enter`) {
          e.preventDefault();
          searchAndRoute();
        }
      }}
      {...props}
    />
  );
};

export default SearchBar;
