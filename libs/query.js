export const TYPES = {
  EXACT: "exact",
  NOT: "not",
  CONTAINS: "contains",
  ENDSWITH: "endswith",
  STARTSWITH: "startswith",
  GT: "gt",
  GTE: "gte",
  LT: "lt",
  LTE: "lte",
  LIKE: "like",
  NOTLIKE: "notlike",
  GLOB: "glob",
  IN: "in",
  NOTIN: "notin",
  ARRAYCONTAINS: "arraycontains",
  DATE: "date",
  ISNULL: "isnull",
  NOTNULL: "notnull",
  ISBLANK: "isblank",
  NOTBLANK: "notblank",
};

export const SHAPES = {
  ARRAYS: "arrays",
  OBJECTS: "objects",
  ARRAY: "array",
  OBJECT: "object",
  ARRAYFIRST: "arrayfirst",
};

export const query = async (
  url,
  { shape = SHAPES.ARRAYS, where = null, facet = null, labels = null }
) => {
  const params =
    where?.reduce(
      (prev, param) => `${prev}&${param.column}__${param.type}=${param.value}`,
      ""
    ) || "";
  const foreign_labels =
    labels?.reduce((prev, label) => `${prev}&_label=${label}`, "") || "";
  try {
    const res = await fetch(
      `http://localhost:8001/db/${url}.json?_shape=${shape}${params}${foreign_labels}${
        facet ? `&_facet=${facet}` : ""
      }&_labels=on`
    );
    const data = await res?.json?.();
    const { error, status, ok } = data;
    if (error) {
      return { error, status, ok, data: null };
    }
    return { data };
  } catch (error) {
    console.log({ error });
    return { error, data: null };
  }
};
