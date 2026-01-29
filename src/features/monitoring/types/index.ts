export interface ApiCall {
    id: string;
    method: string;
    url: string;
    status: number;
    duration: number;
    timestamp: number;
}

export interface PageView {
    path: string;
    title: string;
    count: number;
    timestamp: number;
}

export interface SystemLog {
    id: string;
    timestamp: number;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
}

export interface MonitoringState {
    apiCalls: ApiCall[];
    pageViews: Record<string, PageView>;
    systemLogs: SystemLog[];
}
