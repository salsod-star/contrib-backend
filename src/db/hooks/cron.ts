// import { getConnection } from "typeorm";
// import cron from "node-cron";
// import { Contribution } from "./entities/Contribution";

// // This job will run every day at midnight
// cron.schedule("0 0 * * *", async () => {
//   console.log("Running scheduled job to update due contributions...");

//   // Find all contributions where the NextContributionDate is due (or has passed)
//   const contributionsDue = await getConnection()
//     .getRepository(Contribution)
//     .createQueryBuilder("contribution")
//     .where("contribution.NextContributionDate <= NOW()")
//     .getMany();

//   for (const contribution of contributionsDue) {
//     // Automatically increment the NextContributionDate based on the ContributionInterval
//     await getConnection()
//       .createQueryBuilder()
//       .update(Contribution)
//       .set({
//         NextContributionDate: () =>
//           `NextContributionDate + ContributionInterval`,
//       })
//       .where("ContributionID = :id", { id: contribution.ContributionID })
//       .execute();
//   }

//   console.log("Scheduled job completed: Contributions updated.");
// });
