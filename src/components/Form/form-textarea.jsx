import React from "react";
import { Form } from "react-bootstrap";
import { Field } from "formik";

const FormTextAreaField = ({
  as,
  md,
  controlId,
  label,
  name,
  type,
  inputGroupPrepend,
}) => {
  return (
    <Field
      name={name}
      >{({ field, form, meta }) => {
        const isValid = !form.errors[field.name];
        const isInvalid = form.touched[field.name] && !isValid;
        return (
          <Form.Group as={as} md={md} controlId={controlId}>
            <Form.Label>{label}</Form.Label>
            <Form.Control
              {...field}
              as="textarea"
              isValid={form.touched[field.name] && isValid}
              isInvalid={isInvalid}
              feedback={form.errors[field.name]}
            />

            <Form.Control.Feedback type="invalid">
              {form.errors[field.name]}
            </Form.Control.Feedback>
          </Form.Group>
        );
      }}
    </Field>
  );
};

FormTextAreaField.defaultProps = {
  type: "text",
};

export default FormTextAreaField;
