import { useState, useEffect, useCallback } from "react";

const useFetch = () => {
  const [transactions, setTransactions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [transactionsPerDay, setTransactionsPerDay] = useState({});

  const calculateTransactionsPerDay = useCallback((data) => {
    const transactionsPerDay = {};
    data.forEach((transaction) => {
      const date = transaction.date.split("T")[0];
      transactionsPerDay[date] = (transactionsPerDay[date] || 0) + 1;
    });
    setTransactionsPerDay(transactionsPerDay);
  }, []);

  const fetchData = useCallback(
    (path, id = null) => {
      const url = id
        ? `https://my-json-server.typicode.com/mariamm20/transactions/${path}/${id}`
        : `https://my-json-server.typicode.com/mariamm20/transactions/${path}`;

      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (path === "transactions") {
            setTransactions(data);
            setFilteredTransactions(data);
            calculateTransactionsPerDay(data);
          } else if (path === "customers") {
            if (id) {
              setCustomer(data);
            } else {
              setCustomers(data);
            }
          }
        })
        .catch((error) => console.log(error));
    },
    [calculateTransactionsPerDay]
  );

  useEffect(() => {
    fetchData("transactions");
    fetchData("customers");
  }, [fetchData]);

  const calculateTransactionsPerDaySelectedCustomer = useCallback(
    (transactions, id) => {
      const transactionsPerDay = {};
      transactions.forEach((transaction) => {
        if (transaction.customer_id === id) {
          const date = transaction.date.split("T")[0];
          transactionsPerDay[date] = (transactionsPerDay[date] || 0) + 1;
        }
      });
      setTransactionsPerDay(transactionsPerDay);
    },
    []
  );

  return {
    transactions,
    customers,
    customer,
    fetchData,
    filteredTransactions,
    setFilteredTransactions,
    transactionsPerDay,
    calculateTransactionsPerDay,
    calculateTransactionsPerDaySelectedCustomer,
  };
};

export default useFetch;
