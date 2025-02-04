import React, { useState } from "react";
import { Search, Grid, PeopleFill, Wallet, List } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import useFetch from "../../utilities/useFetch";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);
const Home = () => {
  const {
    transactions,
    filteredTransactions,
    setFilteredTransactions,
    transactionsPerDay,
    calculateTransactionsPerDay,
  } = useFetch("transactions");
  const { customers } = useFetch("customers");
  const [sortOrder, setSortOrder] = useState("asc");

  // Filter transactions
  const filterTransactions = (event) => {
    const query = event.target.value.trim().toLowerCase();

    if (!query) {
      setFilteredTransactions(transactions);
      calculateTransactionsPerDay(transactions);
      return;
    }

    const filtered = transactions.filter((transaction) => {
      const customer = customers.find(
        (customer) => customer.id === transaction.customer_id
      );
      const customerName = customer ? customer.name.toLowerCase() : "";
      return (
        customerName.includes(query) || transaction.amount.toString() === query
      );
    });

    setFilteredTransactions(filtered);
    calculateTransactionsPerDay(filtered);
  };
  // Sort transactions
  const sortTransactions = () => {
    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
      return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
    });
    setFilteredTransactions(sortedTransactions);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Prepare data for Chart.js
  const chartLabels = Object.keys(transactionsPerDay);
  const chartDataValues = Object.values(transactionsPerDay);

  return (
    <div className="container py-lg-2 my-lg-4">
      <p className="text-secondary">Welcome Admin</p>
      <div className="d-flex align-items-center gap-3 py-1 mb-3">
        <Grid color="black" size={32} />
        <h2 className="m-0">Dashboard</h2>
      </div>
      <div className="row d-flex justify-content-around">
        <div className="col-lg-4 col-12 d-flex gap-3 flex-column">
          <div className="p-3 bg-success text-white">
            <div className="d-flex justify-content-between">
              <Wallet color="white" size={32} />
              <h3 className="">
                {transactions.reduce(
                  (total, transaction) =>
                    total + parseFloat(transaction.amount),
                  0
                )}
              </h3>
            </div>
            <h5 className="mt-4 fw-normal">Total Revenue</h5>
          </div>
          <div className="p-3 bg-danger text-white">
            <div className="d-flex justify-content-between">
              <PeopleFill color="white" size={32} />
              <h3 className="">{customers.length}</h3>
            </div>
            <h5 className="mt-4 fw-normal">Number Of Customers</h5>
          </div>
        </div>
        <div className="col-lg-6 col-12">
          <Bar
            data={{
              labels: chartLabels,
              datasets: [
                {
                  label: "Transactions per Day",
                  data: chartDataValues,
                  backgroundColor: "rgba(54, 162, 235, 0.6)",
                  borderColor: "rgba(54, 162, 235, 1)",
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  min: 0,
                  max: Math.max(...chartDataValues) + 1,
                  ticks: {
                    stepSize: 1,
                    callback: function (value) {
                      return Number.isInteger(value) ? value : null;
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="d-flex align-items-center gap-3 py-2 mb-3 mt-5">
        <List color="black" size={32} />
        <h2 className="m-0">Transaction List</h2>
      </div>
      <p className="container px-lg-5 text-secondary">
        By default this table is sorted based on transactions id ascending to
        sort ascending or descending order based on <strong>amount</strong>{" "}
        click on sort button.
      </p>

      <div className="container px-lg-5">
        <div className="input-group mb-3">
          <div className="input-group-prepend d-flex">
            <span
              className="border-end-0 bg-none border-start border-bottom border-top p-2"
              id="basic-addon1">
              <Search size={24} color="black" />
            </span>
          </div>
          <input
            type="text"
            className="form-control border-start-0 rounded-0"
            placeholder="Search by name or amount"
            aria-label="Search"
            onChange={(e) => filterTransactions(e)}
          />
          <button className="btn btn-warning" onClick={sortTransactions}>
            Sort ({sortOrder === "asc" ? "Ascending" : "Descending"})
          </button>
        </div>

        <div className="overflow-auto">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">Transaction Id</th>
                <th scope="col">Customer Name</th>
                <th scope="col">Customer Id</th>
                <th scope="col">Date</th>
                <th scope="col">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.id}</td>
                  <td>
                    <Link
                      to={`/customers/${transaction.customer_id}`}
                      className="text-decoration-none">
                      {
                        customers.find(
                          (customer) => customer.id === transaction.customer_id
                        )?.name
                      }
                    </Link>
                  </td>
                  <td>{transaction.customer_id}</td>
                  <td>{transaction.date}</td>
                  <td>{transaction.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;
