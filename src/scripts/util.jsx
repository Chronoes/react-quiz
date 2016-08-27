export function formGroupValidationClass(valid, warning = false) {
  const base = 'form-group';
  if (valid === true) {
    return `${base} has-success`;
  } else if (valid === false) {
    if (warning) {
      return `${base} has-warning`;
    }
    return `${base} has-danger`;
  }
  return base;
}

export function fillBlankSplit(question) {
  return question.split(/_{3,}/);
}
