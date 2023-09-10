import {
  useState,
  useEffect, useRef
} from "react";

import {
  subcribeChangeEvent,
  unsubcribeChangeEvent,
  getLan,
  changeLan
} from "model/locale";

function useLocale() : [(key: string) => string, (newLan: "en" | "vn") => Promise<void>] {
  const [translations, setTranslations] = useState<Record<string, string>>(getLan());

  const localeTranslate = (key: string): string => {
    return translations[key] ?? key;
  };

  const _isMounted = useRef<boolean>(false);

  useEffect(() => {
    _isMounted.current = true;
    const onChange = (newTranslation) => {
      _isMounted.current && setTranslations(newTranslation);
    };
    subcribeChangeEvent(onChange);

    return () => {
      _isMounted.current = false;
      unsubcribeChangeEvent(onChange)
    };
  }, []);

  return [localeTranslate, changeLan];
}

export default useLocale;
