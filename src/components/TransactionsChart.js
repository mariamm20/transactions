import React, { useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2';

const TransactionsChart = ({ transactions }) => {
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        if (transactions && transactions.length > 0) {
            
            const transactionsPerDay = {};
            transactions.forEach(transaction => {
                console.log(transactions)
                const date = transaction.date.split('T')[0]; // Extract date without time
                if (transactionsPerDay[date]) {
                    transactionsPerDay[date]++;
                } else {
                    transactionsPerDay[date] = 1;
                }
            });

            const chartLabels = Object.keys(transactionsPerDay);
            const chartDataValues = Object.values(transactionsPerDay);

            setChartData({
                labels: chartLabels,
                datasets: [{
                    label: "Transactions per Day",
                    data: chartDataValues,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            });
        } else {
            // Handle case where transactions are empty or not yet loaded
            setChartData({});
        }
    }, [transactions]);

    return (
        <div>
            <h2 className="text-center mb-3">Transactions Chart</h2>
            <Bar data={chartData} />
        </div>
    );
}

export default TransactionsChart;
