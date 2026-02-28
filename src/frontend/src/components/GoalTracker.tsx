import { Check, Loader2, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAddGoal,
  useCompleteGoal,
  useDeleteGoal,
  useGetGoals,
} from "../hooks/useQueries";

export default function GoalTracker() {
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const { data: goals = [], isLoading } = useGetGoals();
  const addGoalMutation = useAddGoal();
  const completeMutation = useCompleteGoal();
  const deleteMutation = useDeleteGoal();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await addGoalMutation.mutateAsync({
        title: newTitle.trim(),
        description: newDesc.trim(),
      });
      setNewTitle("");
      setNewDesc("");
      setIsAdding(false);
      toast.success("Goal added!");
    } catch {
      toast.error("Failed to add goal");
    }
  };

  const handleComplete = async (title: string) => {
    try {
      await completeMutation.mutateAsync(title);
      toast.success("Goal completed! 🎉");
    } catch {
      toast.error("Failed to update goal");
    }
  };

  const handleDelete = async (title: string) => {
    try {
      await deleteMutation.mutateAsync(title);
      toast.success("Goal removed");
    } catch {
      toast.error("Failed to delete goal");
    }
  };

  const completedCount = goals.filter((g) => g.completed).length;

  return (
    <div className="glass-card rounded-2xl p-6 border border-[oklch(0.25_0.04_255/0.5)] flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold font-display neon-text-violet">
            Goal Tracker
          </h3>
          <p className="text-xs text-muted-foreground font-body">
            {completedCount}/{goals.length} completed
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding((v) => !v)}
          className="neon-btn-violet rounded-lg px-3 py-1.5 text-sm font-semibold font-display"
        >
          {isAdding ? "✕ Cancel" : "+ New Goal"}
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd}
            className="overflow-hidden mb-4"
          >
            <div className="space-y-2 pb-2">
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Goal title..."
                className="w-full bg-[oklch(0.09_0.015_260)] border border-[oklch(0.25_0.04_255/0.5)] rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[oklch(0.65_0.22_280/0.8)] transition-colors font-body"
                required
                maxLength={80}
              />
              <input
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Description (optional)..."
                className="w-full bg-[oklch(0.09_0.015_260)] border border-[oklch(0.25_0.04_255/0.5)] rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[oklch(0.65_0.22_280/0.8)] transition-colors font-body"
                maxLength={200}
              />
              <button
                type="submit"
                disabled={addGoalMutation.isPending || !newTitle.trim()}
                className="w-full neon-btn-violet rounded-lg py-2 text-sm font-semibold font-display flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {addGoalMutation.isPending ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : null}
                Add Goal
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Goals list */}
      <div className="flex-1 overflow-y-auto space-y-2 max-h-64 pr-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <span className="text-3xl mb-2">🎯</span>
            <p className="text-sm text-muted-foreground font-body">
              No goals yet. Add your first one!
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {goals.map((goal) => (
              <motion.div
                key={goal.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 group ${
                  goal.completed
                    ? "bg-[oklch(0.82_0.18_142/0.06)] border-[oklch(0.82_0.18_142/0.2)]"
                    : "bg-[oklch(0.09_0.015_260/0.5)] border-[oklch(0.25_0.04_255/0.3)] hover:border-[oklch(0.25_0.04_255/0.6)]"
                }`}
              >
                {/* Complete button */}
                <button
                  type="button"
                  onClick={() => !goal.completed && handleComplete(goal.title)}
                  disabled={goal.completed || completeMutation.isPending}
                  className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 mt-0.5 ${
                    goal.completed
                      ? "bg-[oklch(0.82_0.18_142)] border-[oklch(0.82_0.18_142)] shadow-[0_0_8px_oklch(0.82_0.18_142/0.5)]"
                      : "border-[oklch(0.25_0.04_255)] hover:border-[oklch(0.65_0.22_280)] hover:bg-[oklch(0.65_0.22_280/0.1)]"
                  }`}
                  aria-label={
                    goal.completed ? "Completed" : `Complete ${goal.title}`
                  }
                >
                  {goal.completed && (
                    <Check
                      className="w-3 h-3 text-[oklch(0.07_0.012_260)]"
                      strokeWidth={3}
                    />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-semibold font-body truncate ${
                      goal.completed
                        ? "line-through text-muted-foreground neon-text-green"
                        : "text-foreground"
                    }`}
                  >
                    {goal.title}
                  </p>
                  {goal.description && (
                    <p className="text-xs text-muted-foreground font-body mt-0.5 line-clamp-2">
                      {goal.description}
                    </p>
                  )}
                </div>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => handleDelete(goal.title)}
                  disabled={deleteMutation.isPending}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-[oklch(0.67_0.25_25)] p-1 rounded"
                  aria-label={`Delete ${goal.title}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Progress bar */}
      {goals.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>Progress</span>
            <span>{Math.round((completedCount / goals.length) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-[oklch(0.15_0.02_255)] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "oklch(0.82 0.18 142)",
                boxShadow: "0 0 8px oklch(0.82 0.18 142 / 0.5)",
              }}
              initial={{ width: 0 }}
              animate={{
                width: `${goals.length > 0 ? (completedCount / goals.length) * 100 : 0}%`,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
