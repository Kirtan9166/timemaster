import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DailyStatsView {
    date: string;
    timeBlocks: Array<TimeBlock>;
}
export interface TimeBlock {
    hours: bigint;
    name: string;
}
export interface Goal {
    title: string;
    createdAt: bigint;
    completed: boolean;
    description: string;
}
export interface backendInterface {
    addGoal(title: string, description: string): Promise<void>;
    completeGoal(title: string): Promise<void>;
    deleteGoal(title: string): Promise<void>;
    getAllStats(): Promise<Array<DailyStatsView>>;
    getGoals(): Promise<Array<Goal>>;
    getGoalsCount(): Promise<bigint>;
    saveDailyStats(date: string, timeBlocksArray: Array<TimeBlock>): Promise<void>;
}
