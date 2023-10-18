import { useEffect, useRef, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { GrFormClose } from "react-icons/gr";
import "./searchbar.css";
import { Field } from "formik";
import { Form } from "react-bootstrap";

const SearchBar = ({
  controlId,
  type,
  label,
  placeholder,
  data,
  keyField,
  searchField,
  select,
  value,
  name,
  required,
  selected,
}) => {
  const [search, setSearch] = useState(value ? value : "");
  const [list, setList] = useState(data);
  const [show, setShow] = useState(false);
  const listRef = useRef();

  // Sempre que alterar o estado show
  // a lista será visível ou oculta
  useEffect(() => {
    if (!selected && (show || search.length > 0) && list.length > 0) {
      listRef.current.style.display = "block";
    } else {
      listRef.current.style.display = "none";
    }
  }, [show, search, list, selected]);

  // Sempre que o valor da pesquisa for alterado
  // A lista será filtrada
  useEffect(() => {
    if (data.length >= 1) {
      setList(
        data.filter((item) => {
          return item[searchField].toLowerCase().includes(search.toLowerCase());
        })
      );
    } else {
      setList([{ codigo: 0, nome: "Nenhum item encontrado" }]);
    }
  }, [data, searchField, search]);

  return (
    <Field name={name}>
      {({ field, form, meta }) => {
        const isValid = !form.errors[field.name];
        const isInvalid = form.touched[field.name] && !isValid;
        return (
          <div style={{ position: "relative" }}>
            <BiSearch className="search-icon" size={20} />

            {selected && (
              <div className="selectedItem">
                <span></span>
                <GrFormClose
                  className="close-icon"
                  size={20}
                  onClick={() => {
                    select();
                    form.setFieldValue(name, "");
                  }}
                  title="Remover"
                />
                {`${selected[keyField]} - ${selected[searchField]}`}
              </div>
            )}

            <Form.Group controlId={controlId} className="searchbar">
              <Form.Label>
                {label}
                {required && <span style={{ color: "red" }}>*</span>}
              </Form.Label>

              <Form.Control
                {...field}
                type={type}
                value={search}
                placeholder={placeholder}
                isValid={form.touched[field.name] && isValid}
                isInvalid={isInvalid}
                feedback={form.errors[field.name]}
                onChange={(e) => setSearch(e.target.value)}
                onClick={() => setShow(!show)}
                style={{ paddingLeft: "40px" }}
              />
              <Form.Control.Feedback
                type="invalid"
                style={{ position: "relative" }}
              >
                {form.errors[field.name]}
              </Form.Control.Feedback>
            </Form.Group>
            <div className="result">
              <ul className="data-result" ref={listRef}>
                {list.map((item, i) => {
                  return (
                    <li
                      key={i}
                      onClick={() => {
                        if (item[keyField] !== 0) {
                          select({
                            codigo: item[keyField],
                            nome: item[searchField],
                          });
                          form.setFieldValue(name, {
                            codigo: item[keyField],
                            nome: item[searchField],
                          });
                          setSearch("");
                        }
                      }}
                    >
                      {item[searchField]}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        );
      }}
    </Field>
  );
};

SearchBar.defaultProps = {
  type: "text",
};

export default SearchBar;