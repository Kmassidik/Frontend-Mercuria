import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/api";

export function useDailyMetrics(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ["analytics-daily", startDate, endDate],
    queryFn: () => analyticsApi.getDailyMetrics(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
}

export function useHourlyMetrics(startTime: string, endTime: string) {
  return useQuery({
    queryKey: ["analytics-hourly", startTime, endTime],
    queryFn: () => analyticsApi.getHourlyMetrics(startTime, endTime),
    enabled: !!startTime && !!endTime,
  });
}

export function useMetricsSummary(
  startDate: string,
  endDate: string,
  period = "daily"
) {
  return useQuery({
    queryKey: ["analytics-summary", startDate, endDate, period],
    queryFn: () => analyticsApi.getSummary(startDate, endDate, period),
    enabled: !!startDate && !!endDate,
  });
}

export function useUserAnalytics(
  userId: string,
  startDate: string,
  endDate: string
) {
  return useQuery({
    queryKey: ["user-analytics", userId, startDate, endDate],
    queryFn: () => analyticsApi.getUserAnalytics(userId, startDate, endDate),
    enabled: !!userId && !!startDate && !!endDate,
  });
}

export function useUserSnapshots(
  userId: string,
  startDate: string,
  endDate: string
) {
  return useQuery({
    queryKey: ["user-snapshots", userId, startDate, endDate],
    queryFn: () => analyticsApi.getUserSnapshots(userId, startDate, endDate),
    enabled: !!userId && !!startDate && !!endDate,
  });
}
