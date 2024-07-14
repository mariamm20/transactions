import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function TransactionsList(props) {
  const [transactions, setTransactions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [records, setRecords] = useState([]);
  const [transactionsPerDay, setTransactionsPerDay] = useState({}); // State to hold transactions per day

  useEffect(() => {
    fetchTransactions();
    fetchCustomers();
  });

  function fetchTransactions() {
    fetch('https://my-json-server.typicode.com/mariamm20/transactions/transactions')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setTransactions(data);
        setRecords(data); // Initialize records with all transactions
        calculateTransactionsPerDay(data); // Calculate transactions per day
      })
      .catch(error => console.log(error));
  }

  function fetchCustomers() {
    fetch('https://my-json-server.typicode.com/mariamm20/transactions/customers')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setCustomers(data);
      })
      .catch(error => console.log(error));
  }

  function calculateTransactionsPerDay(data) {
    const transactionsPerDay = {};
    data.forEach(transaction => {
      const date = transaction.date.split('T')[0]; // Extract date without time
      if (transactionsPerDay[date]) {
        transactionsPerDay[date]++;
      } else {
        transactionsPerDay[date] = 1;
      }
    });
    setTransactionsPerDay(transactionsPerDay); // Update state with transactions per day
  }

  function filter(event) {
    const query = event.target.value.toLowerCase();
    const filteredTransactions = transactions.filter(transaction => {
      const customer = customers.find(customer => customer.id === transaction.customer_id);
      const customerName = customer ? customer.name.toLowerCase() : '';
      return (
        customerName.includes(query) ||
        transaction.amount.toString().includes(query)
      );
    });
    setRecords(filteredTransactions); // Update filtered records state
    calculateTransactionsPerDay(filteredTransactions); // Recalculate transactions per day based on filtered data
  }

  // Prepare data for Chart.js
  const chartLabels = Object.keys(transactionsPerDay);
  const chartDataValues = Object.values(transactionsPerDay);

  return (
    <>
      <h2 className="text-center mb-3">Transactions List</h2>
      <Bar
        data={{
          labels: chartLabels,
          datasets: [
            {
              label: "Transactions per Day",
              data: chartDataValues,
              backgroundColor: 'rgba(54, 162, 235, 0.6)', // Example color
              borderColor: 'rgba(54, 162, 235, 1)', // Example border color
              borderWidth: 1
            }
          ]
        }}
      />
      <br />
      <br />
      <input
        type="text"
        className="form-control"
        placeholder="Search by name"
        aria-label="Search"
        onChange={(e) => filter(e)}
      />

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
          {records.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.id}</td>
              <td>{customers.find(customer => customer.id === transaction.customer_id)?.name}</td>
              <td>{transaction.customer_id}</td>
              <td>{transaction.date}</td>
              <td>{transaction.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default TransactionsList;
