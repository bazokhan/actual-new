export const TYPES = {
  EXACT: 'exact',
  NOT: 'not',
  CONTAINS: 'contains',
  ENDSWITH: 'endswith',
  STARTSWITH: 'startswith',
  GT: 'gt',
  GTE: 'gte',
  LT: 'lt',
  LTE: 'lte',
  LIKE: 'like',
  NOTLIKE: 'notlike',
  GLOB: 'glob',
  IN: 'in',
  NOTIN: 'notin',
  ARRAYCONTAINS: 'arraycontains',
  DATE: 'date',
  ISNULL: 'isnull',
  NOTNULL: 'notnull',
  ISBLANK: 'isblank',
  NOTBLANK: 'notblank'
};

export const SHAPES = {
  ARRAYS: 'arrays',
  OBJECTS: 'objects',
  ARRAY: 'array',
  OBJECT: 'object',
  ARRAYFIRST: 'arrayfirst'
};

export const rawQuery = async (url, { shape = SHAPES.ARRAY } = {}) => {
  if (!url) return { error: 'No Url', data: null };
  try {
    const [res, metares] = await Promise.all([
      fetch(url.replace('?_shape=arrays', `?_shape=${shape}`)),
      fetch(url)
    ]);
    const data = await res?.json?.();
    const meta = await metares?.json?.();
    delete meta.rows;
    delete meta.columns;
    const {
      next,
      next_url: nextUrl,
      suggested_facets: suggestedFacets,
      facet_results: facetResults,
      filtered_table_rows_count: rowsCount
    } = meta;
    const { error, status, ok } = data;
    if (error) {
      return {
        error,
        status,
        ok,
        data: null
      };
    }
    return {
      data,
      next,
      nextUrl,
      suggestedFacets,
      facetResults,
      rowsCount
    };
  } catch (error) {
    console.log(error);
    return { error, data: null };
  }
};

export const query = async (
  url,
  { shape = SHAPES.ARRAY, where = null, facet = null, labels = null } = {}
) => {
  if (!url) return { error: 'No Url', data: null };
  const params =
    where?.reduce(
      (prev, param) => `${prev}&${param.column}__${param.type}=${param.value}`,
      ''
    ) || '';
  const foreignLabels =
    labels?.reduce((prev, label) => `${prev}&_label=${label}`, '') || '';
  try {
    const [res, metares] = await Promise.all([
      fetch(
        `http://localhost:8001/db/${url}.json?_shape=${shape}${params}${foreignLabels}${
          facet ? `&_facet=${facet}` : ''
        }`
      ),
      fetch(
        `http://localhost:8001/db/${url}.json?_shape=${
          SHAPES.ARRAYS
        }${params}${foreignLabels}${facet ? `&_facet=${facet}` : ''}`
      )
    ]);
    const data = await res?.json?.();
    const meta = await metares?.json?.();
    delete meta.rows;
    delete meta.columns;
    const {
      next,
      next_url: nextUrl,
      suggested_facets: suggestedFacets,
      facet_results: facetResults,
      filtered_table_rows_count: rowsCount
    } = meta;
    const { error, status, ok } = data;
    if (error) {
      return {
        error,
        status,
        ok,
        data: null
      };
    }
    return {
      data,
      next,
      nextUrl,
      suggestedFacets,
      facetResults,
      rowsCount
    };
  } catch (error) {
    console.log(error);
    return { error, data: null };
  }
};

export const loadAll = async (data, next, nextUrl) => {
  try {
    if (!next) return { data };
    const {
      data: fetchMoreData,
      next: newNext,
      nextUrl: newUrl
    } = await rawQuery(nextUrl);
    if (!fetchMoreData) return { data };
    if (fetchMoreData && !newNext) {
      return { data: [...data, ...fetchMoreData] };
    }
    if (fetchMoreData && newNext) {
      return await loadAll([...data, ...fetchMoreData], newNext, newUrl);
    }
    return { data };
  } catch (err) {
    console.log(err);
    return { data };
  }
};
