
import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Iter "mo:core/Iter";

// use migration from the migration file (with-clause)

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
    timeBlocks : List.List<TimeBlock>;
  };

  type DailyStatsView = {
    date : Text;
    timeBlocks : [TimeBlock];
  };

  // Anonymous Map Storage
  let goalsMap = Map.empty<Text, Goal>();
  let productivityStatsMap = Map.empty<Text, DailyStats>();

  // Stable variables for persistent storage
  stable var goalCount = 0;

  // Goals Management
  public shared ({ caller }) func addGoal(title : Text, description : Text) : async () {
    let goal = {
      title;
      description;
      completed = false;
      createdAt = Time.now();
    };
    goalsMap.add(title, goal);
    goalCount += 1;
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
    switch (goalsMap.get(title)) {
      case (null) {};
      case (?goal) {
        goalsMap.remove(title);
        goalCount -= 1;
      };
    };
  };

  public query ({ caller }) func getGoals() : async [Goal] {
    goalsMap.values().toArray();
  };

  public query ({ caller }) func getGoalsCount() : async Nat {
    goalCount;
  };

  // Productivity Stats Management
  public shared ({ caller }) func saveDailyStats(date : Text, timeBlocksArray : [TimeBlock]) : async () {
    let timeBlocksList = List.fromArray<TimeBlock>(timeBlocksArray);
    let stats = { date; timeBlocks = timeBlocksList };
    productivityStatsMap.add(date, stats);
  };

  public query ({ caller }) func getAllStats() : async [DailyStatsView] {
    let statsList = List.empty<DailyStats>();

    for ((_, stat) in productivityStatsMap.entries()) {
      statsList.add(stat);
    };

    let allStats = statsList.toArray();

    allStats.map(
      func(stat) {
        {
          date = stat.date;
          timeBlocks = stat.timeBlocks.toArray();
        };
      }
    );
  };
};
