import React, {
  ReactElement,
  memo,
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
  NavLink
} from "react-router-dom";

import useLocale from "hooks/useLocale";

import {
  registerAccount
} from "services/account";

import { RegisterError } from "types/services";

import { RoutePath } from "data";
const {
  UserLoginPath
} = RoutePath;

const RegisterPage = (): ReactElement => {
  const [
    inLogin,
    setInLogin
  ] = useState<boolean>(false);
  const [
    formErrorMap,
    setFormErrorMap
  ] = useState<Record<RegisterError, boolean>>({} as Record<RegisterError, boolean>);
  const [
    registerSuccess,
    setRegisterSuccess
  ] = useState(false);

  const [translations] = useLocale();

  const nameInputRef = useRef<HTMLInputElement>();
  const emailInputRef = useRef<HTMLInputElement>();
  const passwordInputRef = useRef<HTMLInputElement>();

  const onInputChange = (): void => {
    setFormErrorMap({} as Record<RegisterError, boolean>);
  };

  const registerToDashboard = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    setInLogin(true);
    const email = emailInputRef.current?.value;
    const password = passwordInputRef.current?.value;
    const name = nameInputRef.current?.value;

    const { errors } = await registerAccount(name, email, password);

    if (!!errors) {
      const newErrorMap: Record<RegisterError, boolean> = {} as Record<RegisterError, boolean>;
      for (const error of errors) {
        newErrorMap[error] = true;
      }

      setFormErrorMap(newErrorMap);
    } else {
      setRegisterSuccess(true);
    }

    setInLogin(false);
  };

  return (
    <div id="main-login-page">
      <div className="d-flex align-items-center justify-content-center login-page__container px-3 px-lg-0">
        <Card className="border-0 shadow flex-fill login-page__form-card">
          <Row className="align-items-center h-100">
            <Col xx={ 12 }>
              {
                !registerSuccess && (
                  <div className="p-5">

                    <div>
                      <Form onSubmit={ registerToDashboard }>
                        <FormGroup>
                          <Label>
                            { translations("form.register.label.name") }
                          </Label>
                          <Input
                            onChange={ onInputChange }
                            innerRef={ nameInputRef }
                            type="text"
                            placeholder={ translations("form.register.hint.name") }/>

                          <FormFeedback className={ !!formErrorMap[RegisterError.InvalidName] ? "d-block" : "" }>
                            { translations("form.register.error.name") }
                          </FormFeedback>
                        </FormGroup>

                        <FormGroup>
                          <Label>
                            { translations("form.register.label.email") }
                          </Label>
                          <Input
                            onChange={ onInputChange }
                            innerRef={ emailInputRef }
                            type="text"
                            placeholder={ translations("form.register.hint.email") }/>

                          <FormFeedback className={ !!formErrorMap[RegisterError.InvalidEmail] ? "d-block" : "" }>
                            { translations("form.register.error.email") }
                          </FormFeedback>
                          <FormFeedback className={ !!formErrorMap[RegisterError.EmailExisted] ? "d-block" : "" }>
                            { translations("form.register.error.idexist") }
                          </FormFeedback>
                        </FormGroup>

                        <FormGroup>
                          <Label>
                            { translations("form.register.label.password") }
                          </Label>
                          <Input
                            onChange={ onInputChange }
                            innerRef={ passwordInputRef }
                            type="password"
                            maxLength={ 25 }
                            placeholder={ translations("form.register.hint.password") }/>

                          <FormFeedback className={ !!formErrorMap[RegisterError.InvalidPassword] ? "d-block" : "" }>
                            { translations("form.register.error.password") }
                          </FormFeedback>
                        </FormGroup>

                        <FormGroup className="mt-4 mb-0">
                          <div className="d-grid login-page__login-btn m-auto">
                            <Button
                              disabled={ inLogin }
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
                            { translations("form.register.button.register") }
                          </span>
                            </Button>
                          </div>
                        </FormGroup>
                      </Form>
                    </div>
                    <div className="text-center">
                      Already member? <NavLink to={ UserLoginPath }>Sign In</NavLink>
                    </div>
                  </div>
                )
              }
              {
                registerSuccess && (
                  <div className="p-5">
                    <h3 className="text-success">
                      <div>
                        Your account has been register successfully.
                      </div>

                      <div className="pt-3">
                        <NavLink to={ UserLoginPath }>Sign In</NavLink>
                      </div>
                    </h3>
                  </div>
                )
              }
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default memo(RegisterPage);
