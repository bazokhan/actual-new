import { useState, useCallback, useMemo, useEffect } from 'react';
import { rawQuery } from '../libs/query';

const usePagination = ({
  data,
  initialNext,
  initialUrl,
  rowsCount,
  tableSize
}) => {
  const [index, setIndex] = useState(0);
  const [dataState, setDataState] = useState(data);
  const [next, setNext] = useState(initialNext);
  const [nextUrl, setNextUrl] = useState(initialUrl);
  const [activePageData, setActivePageData] = useState(data);
  const [loadedAll, setLoadedAll] = useState(false);

  const fetchMore = useCallback(async () => {
    try {
      const {
        data: fetchMoreData,
        next: newNext,
        nextUrl: newUrl
      } = await rawQuery(nextUrl);
      if (fetchMoreData) {
        setDataState([...dataState, ...fetchMoreData]);
      }
      setNext(newNext);
      setNextUrl(newUrl);
    } catch (err) {
      console.log(err);
    }
  }, [dataState, nextUrl]);

  const getNextPage = useCallback(async () => {
    const newIndex = index + 1;
    const targetDataLength = newIndex * tableSize + tableSize;
    if (next && dataState.length <= targetDataLength && !loadedAll) {
      await fetchMore();
    } else {
      setLoadedAll(true);
    }
    setIndex(newIndex);
  }, [index, tableSize, next, dataState.length, loadedAll, fetchMore]);

  const getPrevPage = useCallback(async () => {
    setIndex(index - 1);
  }, [index]);

  const getFirstPage = async () => {
    setIndex(0);
  };

  const getLastPage = async () => {
    setIndex(Math.floor(rowsCount / tableSize));
  };
  const pageNumber = useMemo(() => index + 1, [index]);
  const totalPagesNumber = useMemo(
    () => Math.floor(rowsCount / tableSize) + 1,
    [rowsCount, tableSize]
  );

  useEffect(() => {
    setActivePageData(
      dataState
        .map((t, originalIndex) => ({ ...t, index: originalIndex }))
        .slice(index * tableSize, (index + 1) * tableSize)
    );
  }, [index, dataState, tableSize]);

  const disableNextPageButton = useMemo(
    () => index * tableSize + tableSize >= rowsCount,
    [index, rowsCount, tableSize]
  );
  const disablePrevPageButton = useMemo(() => index <= 0, [index]);
  const isFirstPage = useMemo(() => index === 0, [index]);
  const isLastPage = useMemo(
    () => index === Math.floor(rowsCount / tableSize),
    [index, rowsCount, tableSize]
  );

  return {
    activePageData,
    pageNumber,
    totalPagesNumber,
    disableNextPageButton,
    disablePrevPageButton,
    isFirstPage,
    isLastPage,
    getLastPage,
    getFirstPage,
    getPrevPage,
    getNextPage,
    loadedAll,
    setLoadedAll,
    setDataState
  };
};

export default usePagination;
