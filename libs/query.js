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

export const rawQuery = async (url, { shape = SHAPES.ARRAY } = {}) => {
  try {
    const [res, metares] = await Promise.all([
      fetch(url.replace("?_shape=arrays", `?_shape=${shape}`)),
      fetch(url),
    ]);
    const data = await res?.json?.();
    const meta = await metares?.json?.();
    delete meta.rows;
    delete meta.columns;
    const {
      next,
      next_url,
      suggested_facets,
      facet_results,
      filtered_table_rows_count,
    } = meta;
    const { error, status, ok } = data;
    if (error) {
      return {
        error,
        status,
        ok,
        data: null,
      };
    }
    return {
      data,
      next,
      next_url,
      suggested_facets,
      facet_results,
      filtered_table_rows_count,
    };
  } catch (error) {
    console.log({ error });
    return { error, data: null };
  }
};

export const query = async (
  url,
  { shape = SHAPES.ARRAY, where = null, facet = null, labels = null } = {}
) => {
  const params =
    where?.reduce(
      (prev, param) => `${prev}&${param.column}__${param.type}=${param.value}`,
      ""
    ) || "";
  const foreign_labels =
    labels?.reduce((prev, label) => `${prev}&_label=${label}`, "") || "";
  try {
    const [res, metares] = await Promise.all([
      fetch(
        `http://localhost:8001/db/${url}.json?_shape=${shape}${params}${foreign_labels}${
          facet ? `&_facet=${facet}` : ""
        }`
      ),
      fetch(
        `http://localhost:8001/db/${url}.json?_shape=${
          SHAPES.ARRAYS
        }${params}${foreign_labels}${facet ? `&_facet=${facet}` : ""}`
      ),
    ]);
    const data = await res?.json?.();
    const meta = await metares?.json?.();
    delete meta.rows;
    delete meta.columns;
    const {
      next,
      next_url,
      suggested_facets,
      facet_results,
      filtered_table_rows_count,
    } = meta;
    const { error, status, ok } = data;
    if (error) {
      return {
        error,
        status,
        ok,
        data: null,
      };
    }
    return {
      data,
      next,
      next_url,
      suggested_facets,
      facet_results,
      filtered_table_rows_count,
    };
  } catch (error) {
    console.log({ error });
    return { error, data: null };
  }
};
