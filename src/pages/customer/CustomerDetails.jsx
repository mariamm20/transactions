import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
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

export const CustomerDetails = () => {
  const { id } = useParams();
  const {
    customer,
    fetchData,
    transactions,
    transactionsPerDay,
    calculateTransactionsPerDaySelectedCustomer,
  } = useFetch();

  useEffect(() => {
    fetchData("customers", id);
  }, [id, fetchData]);

  useEffect(() => {
    fetchData("transactions");
  }, [fetchData]);

  useEffect(() => {
    if (transactions.length > 0) {
      calculateTransactionsPerDaySelectedCustomer(transactions, id);
    }
  }, [transactions, id, calculateTransactionsPerDaySelectedCustomer]);

  // Prepare data for Chart.js
  const chartLabels = Object.keys(transactionsPerDay);
  const chartDataValues = Object.values(transactionsPerDay);

  if (!customer) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-lg-2 my-lg-4">
      <p className="text-secondary">Welcome Admin</p>
      <div className="d-flex align-items-center gap-3 py-1 mb-3">
        <h2 className="m-0">Customer Details</h2>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">Customer Id</th>
            <th scope="col">Customer Name</th>
          </tr>
        </thead>
        <tbody>
          <tr key={customer.id}>
            <td>{customer.id}</td>
            <td>{customer.name}</td>
          </tr>
        </tbody>
      </table>

      <div className="d-flex align-items-center gap-3 py-2 mb-3 mt-5">
        <h2 className="m-0">Transaction Per Day Chart</h2>
      </div>
      <div className="w-75">
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
  );
};

export default CustomerDetails;
