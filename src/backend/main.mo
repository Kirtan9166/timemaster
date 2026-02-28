import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";

actor {
  // Data Types
  type Goal = {
    title : Text;
    description : Text;
    completed : Bool;
    createdAt : Int;
  };

  type TimeBlock = {
    name : Text;
    hours : Nat;
  };

  type DailyStats = {
    date : Text;
    timeBlocks : [TimeBlock];
  };

  // Anonymous Map Storage
  let goalsMap = Map.empty<Text, Goal>();
  let productivityStatsMap = Map.empty<Text, DailyStats>();

  // Goal Module (for comparison)
  module Goal {
    public func compare(g1 : Goal, g2 : Goal) : Order.Order {
      if (g1.createdAt < g2.createdAt) { #less } else if (g1.createdAt > g2.createdAt) { #greater } else {
        Text.compare(g1.title, g2.title);
      };
    };
  };

  // Goals Management
  public shared ({ caller }) func addGoal(title : Text, description : Text) : async () {
    let goal = {
      title;
      description;
      completed = false;
      createdAt = Time.now();
    };
    goalsMap.add(title, goal);
  };

  public shared ({ caller }) func completeGoal(title : Text) : async () {
    switch (goalsMap.get(title)) {
      case (null) {};
      case (?goal) {
        let updatedGoal = { goal with completed = true };
        goalsMap.add(title, updatedGoal);
      };
    };
  };

  public shared ({ caller }) func deleteGoal(title : Text) : async () {
    goalsMap.remove(title);
  };

  public query ({ caller }) func getGoals() : async [Goal] {
    goalsMap.values().toArray().sort();
  };

  // Productivity Stats Management
  public shared ({ caller }) func saveDailyStats(date : Text, timeBlocks : [TimeBlock]) : async () {
    let stats = { date; timeBlocks };
    productivityStatsMap.add(date, stats);
  };

  public query ({ caller }) func getAllStats() : async [DailyStats] {
    let statsList = List.empty<DailyStats>();

    for ((_, stat) in productivityStatsMap.entries()) {
      statsList.add(stat);
    };

    statsList.toArray();
  };

  public query ({ caller }) func getGoalsCount() : async Nat {
    goalsMap.size();
  };
};
