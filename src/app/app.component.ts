import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { ChartService } from './chart.service';

interface Metrics {
  revenue: number;
  revenueChange: number;
  activeUsers: number;
  usersChange: number;
  orders: number;
  ordersChange: number;
  conversionRate: number;
  conversionChange: number;
}

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

interface ExportData {
  metrics: Metrics;
  tableData: TableRow[];
  realtimeData: RealtimeData[];
  exportDate: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AppComponent implements OnInit, OnDestroy {
  private chartService = inject(ChartService);
  readonly USD_TO_INR = 83; // 1 USD = 83 INR
  readonly ITEMS_PER_PAGE = 10;
  title = 'TaskIQ';
  isStreaming = false;
  selectedTimeRange = '7d';
  selectedMetric = 'all';
  currentPage = 1;
  totalPages = 1;
  paginatedTableData: TableRow[] = [];
  metrics: Metrics = {
    revenue: 47582 * 83, // Convert to INR
    revenueChange: 12.5,
    activeUsers: 8934,
    usersChange: 8.2,
    orders: 1429,
    ordersChange: -2.4,
    conversionRate: 3.24,
    conversionChange: 5.1
  };

  // Sample data for different time ranges
  private allData: TableRow[] = [
    { day: 'Mon', revenue: 4200, users: 320, orders: 67, conversion: 3.1, growth: 8.2 },
    { day: 'Tue', revenue: 3800, users: 285, orders: 54, conversion: 2.9, growth: -4.5 },
    { day: 'Wed', revenue: 5100, users: 412, orders: 89, conversion: 3.8, growth: 12.1 },
    { day: 'Thu', revenue: 4650, users: 378, orders: 73, conversion: 3.4, growth: 6.8 },
    { day: 'Fri', revenue: 5800, users: 456, orders: 98, conversion: 4.1, growth: 15.3 },
    { day: 'Sat', revenue: 6200, users: 523, orders: 112, conversion: 4.5, growth: 18.7 },
    { day: 'Sun', revenue: 4900, users: 387, orders: 81, conversion: 3.6, growth: 9.4 },
    // Additional data for 30 days
    { day: 'Mon', revenue: 4100, users: 310, orders: 65, conversion: 3.0, growth: 7.8 },
    { day: 'Tue', revenue: 3700, users: 280, orders: 52, conversion: 2.8, growth: -5.2 },
    { day: 'Wed', revenue: 5000, users: 405, orders: 87, conversion: 3.7, growth: 11.8 },
    { day: 'Thu', revenue: 4550, users: 370, orders: 71, conversion: 3.3, growth: 6.5 },
    { day: 'Fri', revenue: 5700, users: 450, orders: 96, conversion: 4.0, growth: 15.0 },
    { day: 'Sat', revenue: 6100, users: 515, orders: 110, conversion: 4.4, growth: 18.3 },
    { day: 'Sun', revenue: 4800, users: 380, orders: 80, conversion: 3.5, growth: 9.1 },
    // Additional data for 90 days
    { day: 'Mon', revenue: 4000, users: 300, orders: 63, conversion: 2.9, growth: 7.5 },
    { day: 'Tue', revenue: 3600, users: 275, orders: 50, conversion: 2.7, growth: -5.5 },
    { day: 'Wed', revenue: 4900, users: 400, orders: 85, conversion: 3.6, growth: 11.5 },
    { day: 'Thu', revenue: 4450, users: 365, orders: 69, conversion: 3.2, growth: 6.2 },
    { day: 'Fri', revenue: 5600, users: 445, orders: 94, conversion: 3.9, growth: 14.7 },
    { day: 'Sat', revenue: 6000, users: 510, orders: 108, conversion: 4.3, growth: 18.0 },
    { day: 'Sun', revenue: 4700, users: 375, orders: 78, conversion: 3.4, growth: 8.8 }
  ];

  tableData: TableRow[] = [];
  realtimeData: RealtimeData[] = [];
  private streamingSubscription?: Subscription;

  ngOnInit() {
    this.updateTableData();
    this.initCharts();
  }

  ngOnDestroy() {
    this.stopStreaming();
    this.chartService.destroyChart('revenueChart');
    this.chartService.destroyChart('userChart');
    this.chartService.destroyChart('realtimeChart');
  }

  toggleStreaming() {
    this.isStreaming = !this.isStreaming;
    if (this.isStreaming) {
      this.startStreaming();
    } else {
      this.stopStreaming();
    }
  }

  startStreaming() {
    this.streamingSubscription = interval(2000).subscribe(() => {
      const newData: RealtimeData = {
        time: new Date().toLocaleTimeString(),
        revenue: Math.floor(Math.random() * 1000) + 500,
        users: Math.floor(Math.random() * 50) + 20,
        orders: Math.floor(Math.random() * 30) + 10
      };

      this.realtimeData.push(newData);
      
      // Keep only last 20 data points
      if (this.realtimeData.length > 20) {
        this.realtimeData.shift();
      }

      // Update real-time chart
      this.chartService.updateRealtimeChart('realtimeChart', this.realtimeData);
    });
  }

  stopStreaming() {
    if (this.streamingSubscription) {
      this.streamingSubscription.unsubscribe();
    }
  }

  onTimeRangeChange() {
    this.updateTableData();
    this.updateCharts();
  }

  onMetricChange() {
    this.updateCharts();
  }

  private updateTableData() {
    switch (this.selectedTimeRange) {
      case '7d':
        this.tableData = this.allData.slice(0, 7);
        break;
      case '30d':
        this.tableData = this.allData.slice(0, 30);
        break;
      case '90d':
        this.tableData = this.allData;
        break;
    }
    // Format percentage values
    this.tableData = this.tableData.map(row => ({
      ...row,
      conversion: Number(row.conversion.toFixed(2)),
      growth: Number(row.growth.toFixed(2))
    }));
    
    // Reset to first page and update pagination
    this.currentPage = 1;
    this.updatePagination();
  }

  private updatePagination() {
    this.totalPages = Math.ceil(this.tableData.length / this.ITEMS_PER_PAGE);
    const startIndex = (this.currentPage - 1) * this.ITEMS_PER_PAGE;
    const endIndex = startIndex + this.ITEMS_PER_PAGE;
    this.paginatedTableData = this.tableData.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  private updateCharts() {
    // Update revenue chart
    this.chartService.destroyChart('revenueChart');
    this.chartService.initRevenueChart('revenueChart', this.tableData);

    // Update user chart
    this.chartService.destroyChart('userChart');
    this.chartService.initUserChart('userChart', this.tableData);

    // Update metrics based on selected time range
    const lastData = this.tableData[this.tableData.length - 1];
    const previousData = this.tableData[this.tableData.length - 2];

    if (lastData && previousData) {
      this.metrics = {
        revenue: lastData.revenue * this.USD_TO_INR, // Convert to INR
        revenueChange: Number(((lastData.revenue - previousData.revenue) / previousData.revenue * 100).toFixed(1)),
        activeUsers: lastData.users,
        usersChange: Number(((lastData.users - previousData.users) / previousData.users * 100).toFixed(1)),
        orders: lastData.orders,
        ordersChange: Number(((lastData.orders - previousData.orders) / previousData.orders * 100).toFixed(1)),
        conversionRate: lastData.conversion,
        conversionChange: Number(((lastData.conversion - previousData.conversion) / previousData.conversion * 100).toFixed(1))
      };
    }
  }

  exportData(format: 'json' | 'csv') {
    const data: ExportData = {
      metrics: this.metrics,
      tableData: this.tableData,
      realtimeData: this.realtimeData,
      exportDate: new Date().toISOString()
    };

    const dataStr = format === 'json' 
      ? JSON.stringify(data, null, 2)
      : this.convertToCSV(data);

    const blob = new Blob([dataStr], { 
      type: format === 'json' ? 'application/json' : 'text/csv' 
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-data.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  }

  private convertToCSV(data: ExportData): string {
    let csv = 'Day,Revenue,Users,Orders,Conversion,Growth\n';
    data.tableData.forEach((row: TableRow) => {
      csv += `${row.day},${row.revenue},${row.users},${row.orders},${row.conversion},${row.growth}\n`;
    });
    return csv;
  }

  private initCharts() {
    // Initialize charts after a short delay to ensure DOM is ready
    setTimeout(() => {
      this.chartService.initRevenueChart('revenueChart', this.tableData);
      this.chartService.initUserChart('userChart', this.tableData);
      this.chartService.initRealtimeChart('realtimeChart');
    }, 100);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  formatPercentage(value: number): string {
    return value.toFixed(1) + '%';
  }
}
