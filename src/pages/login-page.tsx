import React, {
  ReactElement,
  memo,
  useEffect,
  FormEvent,
  useRef,
  useState
} from "react";
import {
  Button,
  Card,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner,
  FormFeedback
} from "reactstrap";
import {
  useNavigate
} from "react-router-dom";

import useLocale from "hooks/useLocale";
import useUserAccount from "hooks/useUserAccount";

import {
  loginByUsernameAndPassword
} from "services/auth";

import { SignInError } from "types/services";

import { RoutePath } from "data";
const {
  MarketItemsOngoingPage: MarketItemsPath
} = RoutePath;

const LoginPage = (): ReactElement => {
  const [{
    token,
    expired
  }] = useUserAccount();
  const [
    inLogin,
    setInLogin
  ] = useState<boolean>();
  const [
    formErrorMap,
    setFormErrorMap
  ] = useState<Record<SignInError, boolean>>({
    [SignInError.InvalidEmail] : false,
    [SignInError.IncorrectEmailOrPassword] : false
  });

  const [translations] = useLocale();
  const navigate = useNavigate();

  const emailInputRef = useRef<HTMLInputElement>();
  const passwordInputRef = useRef<HTMLInputElement>();
  const navigatingRef = useRef(false);

  useEffect(() => {
    if (!!token && !expired) {
      if (!navigatingRef.current) {
        navigatingRef.current = true;
        navigate(MarketItemsPath);
      }
    }
  }, [
    token,
    expired,
    navigate
  ]);

  const onInputChange = (): void => {
    setFormErrorMap((prevState : Record<SignInError, boolean>) => {
      return {
        ...prevState,
        [SignInError.InvalidEmail] : false,
        [SignInError.IncorrectEmailOrPassword] : false
      };
    });
  };

  const loginToDashboard = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    setInLogin(true);
    const email = emailInputRef.current?.value;
    const password = passwordInputRef.current?.value;

    const { errors } = await loginByUsernameAndPassword(email, password);

    if (!!errors) {
      const newErrorMap : Record<SignInError, boolean> = {} as Record<SignInError, boolean>;
      for (const error of errors) {
        newErrorMap[error] = true;
      }

      setFormErrorMap(newErrorMap);
    } else {
      navigate(MarketItemsPath);
    }

    setInLogin(false);
  };

  return (
    <div id="main-login-page">
      <div className="d-flex align-items-center justify-content-center login-page__container px-3 px-lg-0">
        <Card className="border-0 shadow flex-fill login-page__form-card">
          <Row className="align-items-center h-100">
            <Col xx={12}>
              <div className="p-5">
                <div>
                  <Form onSubmit={loginToDashboard}>
                    <FormGroup>
                      <Label>
                        {translations("form.login.label.username")}
                      </Label>
                      <Input
                        onChange={onInputChange}
                        innerRef={emailInputRef}
                        type="text"
                        placeholder={translations("form.login.hint.username")}/>

                      <FormFeedback className={ !!formErrorMap[SignInError.InvalidEmail] ? "d-block" : "" }>
                        { translations("form.login.error.invalidEmail") }
                      </FormFeedback>
                    </FormGroup>

                    <FormGroup>
                      <Label>
                        {translations("form.login.label.password")}
                      </Label>
                      <Input
                        onChange={onInputChange}
                        innerRef={passwordInputRef}
                        type="password"
                        placeholder={translations("form.login.hint.password")}/>

                      <FormFeedback className={ !!formErrorMap[SignInError.IncorrectEmailOrPassword] ? "d-block" : "" }>
                        { translations("form.login.error.incorrectCredential") }
                      </FormFeedback>
                    </FormGroup>

                    <FormGroup className="mt-4 mb-0">
                      <div className="d-grid login-page__login-btn m-auto">
                        <Button
                          disabled={inLogin}
                          type="submit"
                          color="primary">
                          {
                            inLogin && (
                              <Spinner size="sm">
                                Loading...
                              </Spinner>
                            )
                          }
                          <span>
                            {
                              inLogin ?
                                translations("form.login.button.loading") :
                                translations("form.login.button.main")
                            }
                          </span>
                        </Button>
                      </div>
                    </FormGroup>
                  </Form>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default memo(LoginPage);
