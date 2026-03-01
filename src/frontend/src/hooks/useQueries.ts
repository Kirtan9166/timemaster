import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { DailyStatsView, Goal, TimeBlock } from "../backend.d";
import { useActor } from "./useActor";

export function useGetGoals() {
  const { actor, isFetching } = useActor();
  return useQuery<Goal[]>({
    queryKey: ["goals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGoals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetGoalsCount() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["goalsCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getGoalsCount();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllStats() {
  const { actor, isFetching } = useActor();
  return useQuery<DailyStatsView[]>({
    queryKey: ["allStats"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      description,
    }: { title: string; description: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.addGoal(title, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["goalsCount"] });
    },
  });
}

export function useCompleteGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (title: string) => {
      if (!actor) throw new Error("No actor");
      return actor.completeGoal(title);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}

export function useDeleteGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (title: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteGoal(title);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["goalsCount"] });
    },
  });
}

export function useSaveDailyStats() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      date,
      timeBlocks,
    }: { date: string; timeBlocks: TimeBlock[] }) => {
      if (!actor) throw new Error("No actor");
      return actor.saveDailyStats(date, timeBlocks);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allStats"] });
    },
  });
}
