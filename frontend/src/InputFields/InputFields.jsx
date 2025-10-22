const InputFields = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  options = [],
  min,
  max,
  step,
}) => {
  const commonProps = {
    className: 'form-control',
    name,
    value,
    onChange,
    placeholder,
    required,
    min,
    max,
    step,
  };

  if (name === 'phone') {
    commonProps.type = 'tel';
    commonProps.pattern = '[0-9()+\\- ]{10,20}';
    commonProps.title = 'Enter a valid US phone number';
    commonProps.maxLength = 20;
  }

  if (name === 'zipcode') {
    commonProps.type = 'text';
    commonProps.pattern = '[0-9]{5}';
    commonProps.title = 'Zip code must be exactly 5 digits';
    commonProps.maxLength = 5;
  }

if (type === 'select') {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <select className="form-select" {...commonProps}>
        <option value="">Select {label}</option>
        {options.map((option, idx) => {
          if (typeof option === "string") {
            return (
              <option key={idx} value={option}>
                {option}
              </option>
            );
          }
          return (
            <option key={idx} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
    </div>
  );
}


  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <input type={type} {...commonProps} />
    </div>
  );
};

export default InputFields;
