import { Injectable } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

interface TableRow {
  day: string;
  revenue: number;
  users: number;
  orders: number;
  conversion: number;
  growth: number;
}

interface RealtimeData {
  time: string;
  revenue: number;
  users: number;
  orders: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  private charts: Record<string, Chart> = {};
  private readonly USD_TO_INR = 83;

  constructor() {
    // Register all Chart.js components
    Chart.register(...registerables);
  }

  initRevenueChart(canvasId: string, data: TableRow[]) {
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'line' as ChartType,
      data: {
        labels: data.map(d => d.day),
        datasets: [{
          label: 'Revenue (INR)',
          data: data.map(d => d.revenue * this.USD_TO_INR),
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              callback: (value) => {
                return new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 2
                }).format(value as number);
              }
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    };

    this.charts[canvasId] = new Chart(ctx, config);
  }

  initUserChart(canvasId: string, data: TableRow[]) {
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'bar' as ChartType,
      data: {
        labels: data.map(d => d.day),
        datasets: [{
          label: 'Active Users',
          data: data.map(d => d.users),
          backgroundColor: '#2196F3',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    };

    this.charts[canvasId] = new Chart(ctx, config);
  }

  initRealtimeChart(canvasId: string) {
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'line' as ChartType,
      data: {
        labels: [],
        datasets: [
          {
            label: 'Revenue (INR)',
            data: [],
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Users',
            data: [],
            borderColor: '#2196F3',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Orders',
            data: [],
            borderColor: '#FF9800',
            backgroundColor: 'rgba(255, 152, 0, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              callback: (value) => {
                return new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 2
                }).format(value as number);
              }
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    };

    this.charts[canvasId] = new Chart(ctx, config);
  }

  updateRealtimeChart(canvasId: string, data: RealtimeData[]) {
    const chart = this.charts[canvasId];
    if (!chart) return;

    chart.data.labels = data.map(d => d.time);
    chart.data.datasets[0].data = data.map(d => d.revenue * this.USD_TO_INR);
    chart.data.datasets[1].data = data.map(d => d.users);
    chart.data.datasets[2].data = data.map(d => d.orders);
    chart.update();
  }

  destroyChart(canvasId: string) {
    const chart = this.charts[canvasId];
    if (chart) {
      chart.destroy();
      delete this.charts[canvasId];
    }
  }
} 