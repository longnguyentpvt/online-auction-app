import {
  useState,
  useRef,
  useEffect
} from "react";

import {
  getInfo,
  subscribeAccountChange,
  unsubscribeAccountChange
} from "model/user-account";
import {
  getAccountInfo
} from "services/account";

import { UserSessionModel } from "types/models";

const accountInfoSync = async() : Promise<void> => {
  await getAccountInfo();
};

function useUserAccount(): [account: UserSessionModel, syncInfo: () => Promise<void>] {
  const [
    account,
    setAccount
  ] = useState<UserSessionModel>(getInfo());

  const _isMounted = useRef<boolean>(false);

  useEffect(() => {
    _isMounted.current = true;
    setAccount(getInfo());

    const onNewData = (): void => {
      if (_isMounted.current) {
        const newInfo = getInfo();
        setAccount(newInfo);
      }
    };

    subscribeAccountChange(onNewData);

    return () => {
      _isMounted.current = false;
      unsubscribeAccountChange(onNewData);
    };
  }, []);

  return [account, accountInfoSync];
}

export default useUserAccount;
